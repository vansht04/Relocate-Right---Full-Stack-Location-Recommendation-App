import OrderedMap "mo:base/OrderedMap";
import Text "mo:base/Text";
import Float "mo:base/Float";
import Iter "mo:base/Iter";
import List "mo:base/List";
import Array "mo:base/Array";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Debug "mo:base/Debug";

import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor RelocateRight {
  transient let textMap = OrderedMap.Make<Text>(Text.compare);
  transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);

  type Coordinates = {
    latitude : Float;
    longitude : Float;
  };

  type Area = {
    name : Text;
    coordinates : Coordinates;
    hospitalProximity : Float; // 0-10 scale
    schoolQuality : Float; // 0-10 scale
    parkAvailability : Float; // 0-10 scale
    safetyRating : Float; // 0-10 scale
    communityCenterAccess : Float; // 0-10 scale
    population : Nat;
    mayor : Text;
    lifestyleDescription : Text;
    funFact : Text;
  };

  type UserPreferences = {
    hospitalImportance : Float; // 0-1
    schoolImportance : Float; // 0-1
    parkImportance : Float; // 0-1
    safetyImportance : Float; // 0-1
    communityCenterImportance : Float; // 0-1
  };

  type Recommendation = {
    area : Area;
    matchPercentage : Float;
    explanation : Text;
  };

  type UserData = {
    preferences : UserPreferences;
    lastRecommendations : [Recommendation];
  };

  public type UserProfile = {
    name : Text;
    preferences : ?UserPreferences;
  };

  var areas : OrderedMap.Map<Text, Area> = textMap.fromIter<Area>(
    Iter.fromArray([
      (
        "Green Valley",
        {
          name = "Green Valley";
          coordinates = { latitude = 40.7128; longitude = -74.0060 };
          hospitalProximity = 8.5;
          schoolQuality = 9.0;
          parkAvailability = 7.5;
          safetyRating = 8.0;
          communityCenterAccess = 6.5;
          population = 50000;
          mayor = "Jane Smith";
          lifestyleDescription = "Family-friendly with great schools and parks.";
          funFact = "Known for its annual flower festival.";
        },
      ),
      (
        "Sunnydale",
        {
          name = "Sunnydale";
          coordinates = { latitude = 34.0522; longitude = -118.2437 };
          hospitalProximity = 7.0;
          schoolQuality = 8.5;
          parkAvailability = 9.0;
          safetyRating = 7.5;
          communityCenterAccess = 8.0;
          population = 75000;
          mayor = "John Doe";
          lifestyleDescription = "Vibrant community with excellent parks.";
          funFact = "Home to the largest community center in the region.";
        },
      ),
      (
        "River City",
        {
          name = "River City";
          coordinates = { latitude = 41.8781; longitude = -87.6298 };
          hospitalProximity = 9.0;
          schoolQuality = 7.5;
          parkAvailability = 6.0;
          safetyRating = 8.5;
          communityCenterAccess = 7.0;
          population = 120000;
          mayor = "Emily Clark";
          lifestyleDescription = "Safe area with top-rated hospitals.";
          funFact = "Famous for its historic riverfront district.";
        },
      ),
      (
        "Mountain View",
        {
          name = "Mountain View";
          coordinates = { latitude = 37.3861; longitude = -122.0839 };
          hospitalProximity = 6.5;
          schoolQuality = 8.0;
          parkAvailability = 8.5;
          safetyRating = 7.0;
          communityCenterAccess = 9.0;
          population = 60000;
          mayor = "Michael Brown";
          lifestyleDescription = "Great for outdoor enthusiasts.";
          funFact = "Has over 50 miles of hiking trails.";
        },
      ),
      (
        "Lakeside",
        {
          name = "Lakeside";
          coordinates = { latitude = 42.3601; longitude = -71.0589 };
          hospitalProximity = 8.0;
          schoolQuality = 7.0;
          parkAvailability = 7.5;
          safetyRating = 8.0;
          communityCenterAccess = 6.0;
          population = 45000;
          mayor = "Sarah Lee";
          lifestyleDescription = "Peaceful area with beautiful lake views.";
          funFact = "Hosts an annual lakeside music festival.";
        },
      ),
    ])
  );

  var userData : OrderedMap.Map<Principal, UserData> = principalMap.empty<UserData>();
  var userProfiles : OrderedMap.Map<Principal, UserProfile> = principalMap.empty<UserProfile>();

  // Access control state
  var accessControlState = AccessControl.initState();

  // Initialize access control (first caller becomes admin)
  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    // Admin-only check happens inside AccessControl.assignRole
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  // User profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can access profiles");
    };
    principalMap.get(userProfiles, caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Can only view your own profile");
    };
    principalMap.get(userProfiles, user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles := principalMap.put(userProfiles, caller, profile);
  };

  // Public area data - accessible to all including guests
  public query func getAllAreas() : async [Area] {
    Iter.toArray(textMap.vals(areas));
  };

  public query func getAreaByName(name : Text) : async ?Area {
    textMap.get(areas, name);
  };

  // Recommendations - accessible to all including guests
  public query func getRecommendations(preferences : UserPreferences) : async [Recommendation] {
    let areaList = Iter.toArray(textMap.vals(areas));
    var recommendations = List.nil<Recommendation>();

    for (area in areaList.vals()) {
      let matchScore = calculateMatchScore(area, preferences);
      let recommendation : Recommendation = {
        area;
        matchPercentage = matchScore * 10.0;
        explanation = generateExplanation(area, preferences, matchScore);
      };
      recommendations := List.push(recommendation, recommendations);
    };

    let sortedRecommendations = List.toArray(recommendations);
    let sorted = Array.sort<Recommendation>(
      sortedRecommendations,
      func(a, b) {
        if (a.matchPercentage > b.matchPercentage) { #less } else if (a.matchPercentage < b.matchPercentage) {
          #greater;
        } else { #equal };
      },
    );

    let topRecommendations = if (sorted.size() >= 3) {
      [sorted[0], sorted[1], sorted[2]];
    } else {
      sorted;
    };

    topRecommendations;
  };

  func calculateMatchScore(area : Area, preferences : UserPreferences) : Float {
    let hospitalScore = area.hospitalProximity * preferences.hospitalImportance;
    let schoolScore = area.schoolQuality * preferences.schoolImportance;
    let parkScore = area.parkAvailability * preferences.parkImportance;
    let safetyScore = area.safetyRating * preferences.safetyImportance;
    let communityCenterScore = area.communityCenterAccess * preferences.communityCenterImportance;

    let totalScore = hospitalScore + schoolScore + parkScore + safetyScore + communityCenterScore;
    let maxScore = 10.0 * (preferences.hospitalImportance + preferences.schoolImportance + preferences.parkImportance + preferences.safetyImportance + preferences.communityCenterImportance);

    if (maxScore == 0.0) { 0.0 } else { totalScore / maxScore };
  };

  func generateExplanation(area : Area, preferences : UserPreferences, matchScore : Float) : Text {
    let scoreText = Float.toText(matchScore * 100.0);
    let hospitalText = if (preferences.hospitalImportance > 0.5) {
      "Strong hospital proximity: " # Float.toText(area.hospitalProximity) # ". ";
    } else { "" };

    let schoolText = if (preferences.schoolImportance > 0.5) {
      "Excellent schools: " # Float.toText(area.schoolQuality) # ". ";
    } else { "" };

    let parkText = if (preferences.parkImportance > 0.5) {
      "Great parks: " # Float.toText(area.parkAvailability) # ". ";
    } else { "" };

    let safetyText = if (preferences.safetyImportance > 0.5) {
      "High safety rating: " # Float.toText(area.safetyRating) # ". ";
    } else { "" };

    let communityCenterText = if (preferences.communityCenterImportance > 0.5) {
      "Good community center access: " # Float.toText(area.communityCenterAccess) # ". ";
    } else { "" };

    "Match score: " # scoreText # "%. " # hospitalText # schoolText # parkText # safetyText # communityCenterText # "Population: " # Nat.toText(area.population) # ". Mayor: " # area.mayor # ". Fun fact: " # area.funFact;
  };

  // Save user preferences and last recommendations - users only
  public shared ({ caller }) func saveUserData(preferences : UserPreferences, recommendations : [Recommendation]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can save data");
    };

    let data : UserData = {
      preferences;
      lastRecommendations = recommendations;
    };

    userData := principalMap.put(userData, caller, data);
  };

  // Get user preferences and last recommendations - users only
  public query ({ caller }) func getUserData() : async ?UserData {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can access data");
    };

    principalMap.get(userData, caller);
  };

  // Get personalized greeting - accessible to all including guests
  public query ({ caller }) func getPersonalizedGreeting() : async Text {
    "Welcome to Relocate Right! Your Principal ID is: " # Principal.toText(caller);
  };
};

