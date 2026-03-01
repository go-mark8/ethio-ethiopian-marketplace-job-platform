import Array "mo:core/Array";
import Map "mo:core/Map";
import Set "mo:core/Set";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";


import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

// Apply migration on upgrade

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  var nextProductId = 1;

  public type ProductCategory = {
    #clothing;
    #electronics;
    #handmade;
    #furniture;
    #books;
    #art;
    #food;
    #cars;
    #bikes;
    #music;
    #services;
    #none;
  };

  module ProductCategory {
    public func compare(c1 : ProductCategory, c2 : ProductCategory) : Order.Order {
      switch (c1, c2) {
        case (#clothing, #clothing) { #equal };
        case (#clothing, _) { #less };
        case (_, #clothing) { #greater };

        case (#electronics, #electronics) { #equal };
        case (#electronics, _) { #less };
        case (_, #electronics) { #greater };

        case (#handmade, #handmade) { #equal };
        case (#handmade, _) { #less };
        case (_, #handmade) { #greater };

        case (#furniture, #furniture) { #equal };
        case (#furniture, _) { #less };
        case (_, #furniture) { #greater };

        case (#books, #books) { #equal };
        case (#books, _) { #less };
        case (_, #books) { #greater };

        case (#art, #art) { #equal };
        case (#art, _) { #less };
        case (_, #art) { #greater };

        case (#food, #food) { #equal };
        case (#food, _) { #less };
        case (_, #food) { #greater };

        case (#cars, #cars) { #equal };
        case (#cars, _) { #less };
        case (_, #cars) { #greater };

        case (#bikes, #bikes) { #equal };
        case (#bikes, _) { #less };
        case (_, #bikes) { #greater };

        case (#music, #music) { #equal };
        case (#music, _) { #less };
        case (_, #music) { #greater };

        case (#services, #services) { #equal };
        case (#services, _) { #less };
        case (_, #services) { #greater };

        case (#none, #none) { #equal };
      };
    };
  };

  let EMPTY_CATEGORY : ProductCategory = #none;

  public type Product = {
    id : Text;
    title : Text;
    price : Nat;
    description : Text;
    images : [Storage.ExternalBlob];
    seller : Principal;
    category : ProductCategory;
    createdAt : Time.Time;
    var views : Nat;
  };

  module Product {
    public func compare(a : Product, b : Product) : Order.Order {
      Text.compare(a.id, b.id);
    };
  };

  public type JobCategory = {
    #technology;
    #education;
    #healthcare;
    #construction;
    #hospitality;
    #retail;
    #transportation;
    #none;
  };

  module JobCategory {
    public func compare(c1 : JobCategory, c2 : JobCategory) : Order.Order {
      switch (c1, c2) {
        case (#technology, #technology) { #equal };
        case (#technology, _) { #less };
        case (_, #technology) { #greater };

        case (#education, #education) { #equal };
        case (#education, _) { #less };
        case (_, #education) { #greater };

        case (#healthcare, #healthcare) { #equal };
        case (#healthcare, _) { #less };
        case (_, #healthcare) { #greater };

        case (#construction, #construction) { #equal };
        case (#construction, _) { #less };
        case (_, #construction) { #greater };

        case (#hospitality, #hospitality) { #equal };
        case (#hospitality, _) { #less };
        case (_, #hospitality) { #greater };

        case (#retail, #retail) { #equal };
        case (#retail, _) { #less };
        case (_, #retail) { #greater };

        case (#transportation, #transportation) { #equal };
        case (#transportation, _) { #less };
        case (_, #transportation) { #greater };

        case (#none, #none) { #equal };
      };
    };
  };

  let EMPTY_JOB_CATEGORY : JobCategory = #none;

  public type Job = {
    id : Text;
    title : Text;
    description : Text;
    location : Text;
    company : Text;
    category : JobCategory;
    postedBy : Principal;
    postedAt : Time.Time;
    salary : ?Nat;
  };

  module Job {
    public func compare(a : Job, b : Job) : Order.Order {
      Text.compare(a.id, b.id);
    };
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
    createdAt : Time.Time;
  };

  // Storage
  let products = Map.empty<Text, Product>();
  let jobs = Map.empty<Text, Job>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let favorites = Map.empty<Principal, Set.Set<Text>>();
  let messages = Map.empty<Text, List.List<Message>>();
  let subscriptions = Map.empty<Text, Subscription>();

  type Subscription = {
    id : Text;
    userId : Principal;
    subscriptionType : {
      #product;
      #job;
    };
    category : Text;
    createdAt : Time.Time;
  };

  public type Message = {
    id : Text;
    sender : Principal;
    receiver : Principal;
    content : Text;
    timestamp : Time.Time;
    var isRead : Bool;
  };

  // User Profile Management Functions

  // Register a new user profile (requires authenticated user)
  public shared ({ caller }) func registerUserProfile(
    name : Text,
    email : Text,
    phone : Text,
  ) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can register profiles");
    };

    let newProfile : UserProfile = {
      name;
      email;
      phone;
      createdAt = Time.now();
    };

    userProfiles.add(caller, newProfile);
    true;
  };

  // Get the caller's own profile
  public shared query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view profiles");
    };
    userProfiles.get(caller);
  };

  // Save/update the caller's own profile
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Get any user's profile (own profile or admin can view others)
  public shared query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile unless you are an admin");
    };
    userProfiles.get(user);
  };

  // Product Management Functions

  public type ProductCreationData = {
    title : Text;
    price : Nat;
    description : Text;
    images : [Storage.ExternalBlob];
    category : ProductCategory;
  };

  public type ProductView = {
    id : Text;
    title : Text;
    price : Nat;
    description : Text;
    images : [Storage.ExternalBlob];
    seller : Principal;
    category : ProductCategory;
    createdAt : Time.Time;
    views : Nat;
  };

  func toProductView(product : Product) : ProductView {
    {
      id = product.id;
      title = product.title;
      price = product.price;
      description = product.description;
      images = product.images;
      seller = product.seller;
      category = product.category;
      createdAt = product.createdAt;
      views = product.views;
    };
  };

  // Create a new product listing (requires authenticated user)
  public shared ({ caller }) func createProduct(data : ProductCreationData) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated sellers can create products");
    };

    let productId = nextProductId.toText();
    nextProductId += 1;

    let newProduct : Product = {
      id = productId;
      title = data.title;
      price = data.price;
      description = data.description;
      images = data.images;
      seller = caller;
      category = data.category;
      createdAt = Time.now();
      var views = 0;
    };

    products.add(productId, newProduct);
    productId;
  };

  // Increment product view count (public - no authentication required)
  // Anyone including guests can view products
  public shared ({ caller }) func incrementProductViews(productId : Text) : async () {
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found: " # productId) };
      case (?product) {
        // Only increment if viewer is not the seller
        if (product.seller != caller) {
          product.views += 1;
        };
      };
    };
  };

  // Get all products (public query)
  public shared query ({ caller }) func getAllProducts() : async [ProductView] {
    products.values().toArray().map(toProductView);
  };

  // Get products by a specific seller (public query)
  public shared query ({ caller }) func getProductsBySeller(seller : Principal) : async [ProductView] {
    let filtered = products.filter(
      func(_id, product) {
        product.seller == seller;
      }
    );
    filtered.values().toArray().map(toProductView);
  };

  // Get top viewed products (public query)
  public shared query ({ caller }) func getTopViewedProducts(limit : Nat) : async [ProductView] {
    let productIter = products.values();
    let productArray = productIter.toArray();
    let sortedProducts = productArray.sort(
      func(a, b) {
        Nat.compare(b.views, a.views);
      }
    );
    if (sortedProducts.size() <= limit) { return sortedProducts.map(toProductView) };
    Array.tabulate<ProductView>(limit, func(i) { toProductView(sortedProducts[i]) });
  };
};

