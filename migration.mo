import OrderedMap "mo:base/OrderedMap";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Float "mo:base/Float";
import AccessControl "authorization/access-control";

module {
  type Coordinates = {
    latitude : Float;
    longitude : Float;
  };

  type Area = {
    name : Text;
    coordinates : Coordinates;
    hospitalProximity : Float;
    schoolQuality : Float;
    parkAvailability : Float;
    safetyRating : Float;
    communityCenterAccess : Float;
    population : Nat;
    mayor : Text;
    lifestyleDescription : Text;
    funFact : Text;
  };

  type OldActor = {
    areas : OrderedMap.Map<Text, Area>;
  };

  type NewActor = {
    areas : OrderedMap.Map<Text, Area>;
    userProfiles : OrderedMap.Map<Principal, { name : Text; preferences : ?{ hospitalImportance : Float; schoolImportance : Float; parkImportance : Float; safetyImportance : Float; communityCenterImportance : Float } }>;
    accessControlState : AccessControl.AccessControlState;
  };

  public func run(old : OldActor) : NewActor {
    let accessControlState = AccessControl.initState();
    let principalMap = OrderedMap.Make<Principal>(Principal.compare);
    {
      areas = old.areas;
      userProfiles = principalMap.empty<{ name : Text; preferences : ?{ hospitalImportance : Float; schoolImportance : Float; parkImportance : Float; safetyImportance : Float; communityCenterImportance : Float } }>();
      accessControlState;
    };
  };
};

