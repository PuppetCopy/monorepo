export enum AttributeMappings {
  'Afro Green' = 78,
  'Afro Multicolor' = 42,
  'Afro Pink' = 34,
  Angry = 59,
  'Army Green' = 116,
  'Army Helmet' = 95,
  'Army Pink' = 128,
  Arrow = 138,
  Basket = 142,
  'Basketball Green' = 50,
  'Basketball Red' = 112,
  'Bathrobe Grey' = 119,
  'Bathrobe Orange' = 103,
  'Beanie Grey' = 65,
  'Beanie Red' = 67,
  'Bear Cap' = 126,
  'Bear Fur' = 127,
  'Beard Green' = 102,
  'Beard Multicolor' = 98,
  'Beard Pink' = 64,
  'Black and White' = 145,
  Blind = 44,
  Blue = 16,
  Blueberry = 5,
  Bone = 84,
  Bored = 6,
  'Bowtie Green' = 83,
  'Bowtie Pink' = 131,
  Brain = 136,
  Bubblegum = 33,
  'Bucket Hat Green' = 45,
  'Bucket Hat Purple' = 68,
  'Bucket Hat Red' = 108,
  Bull = 77,
  'Bull Horns' = 61,
  'Cap Blue' = 47,
  'Cap Pink' = 121,
  'Cap Yellow' = 8,
  Chain = 133,
  Chef = 35,
  Cigarette = 75,
  Clown = 130,
  Crying = 139,
  Cute = 89,
  'Damaged Shirt Grey' = 132,
  'Damaged Shirt Purple' = 96,
  Dead = 92,
  Devil = 141,
  'Devil Horns' = 97,
  Dizzy = 63,
  'Double Bun Blue' = 111,
  'Double Bun Purple' = 76,
  Dumb = 53,
  'Durag Blue' = 70,
  'Durag Grey' = 80,
  'Durag Orange' = 105,
  Eyepatch = 54,
  Fear = 26,
  'Flower Blue' = 71,
  'Flower Green' = 115,
  'Flower Sunglasses Blue' = 90,
  'Flower Sunglasses Green' = 14,
  Gold = 146,
  Green = 39,
  'Green Candle' = 143,
  Grey = 3,
  'Grillz Gold' = 124,
  'Grillz Multicolor' = 41,
  'Grillz Silver' = 94,
  Halo = 137,
  Happy = 17,
  'Hawaiian Shirt Orange' = 87,
  'Hawaiian Shirt Yellow' = 85,
  'Headband Purple' = 91,
  'Headband Yellow' = 122,
  'Heart Glasses' = 114,
  'Hoodie Blue' = 52,
  'Hoodie Multicolor' = 40,
  'Hoodie Pink' = 25,
  King = 23,
  'King Robe' = 123,
  Laughing = 107,
  Looser = 2,
  'Medical Mask' = 62,
  'Mohawk Green' = 99,
  'Mohawk Red' = 101,
  Neird = 56,
  Ninja = 10,
  Nude = 144,
  Orange = 24,
  'Overalls Green' = 48,
  'Overalls Red' = 81,
  Pink = 20,
  Pipe = 82,
  Pirate = 88,
  'Pixel Glasses' = 100,
  Police = 117,
  'Puffer Multicolor' = 21,
  'Puffer Purple' = 140,
  'Puffer Yellow' = 125,
  Purple = 12,
  Red = 46,
  'Red Laser' = 60,
  Rich = 73,
  Rugpull = 15,
  Sad = 86,
  'Sexy Doctor' = 79,
  'Shirt Blue' = 58,
  'Shirt Yellow' = 66,
  'Ski Sunglasses Blue' = 37,
  'Ski Sunglasses Pink' = 49,
  Sleeping = 32,
  'Soccer Jersey' = 72,
  Sombrero = 134,
  Stitches = 93,
  'Straw Hat' = 51,
  'Suit Black' = 4,
  'Suit Pink' = 110,
  'Sunglasses Green' = 7,
  'Sunglasses Red' = 29,
  Surprised = 36,
  'Sweater Grey' = 113,
  'Sweater Red' = 31,
  'Tank Top Black' = 55,
  'Tank Top White' = 104,
  Thinking = 22,
  'Top Hat' = 129,
  'Tshirt Green' = 43,
  'Tshirt Grey' = 106,
  'Tshirt Orange' = 28,
  'Tshirt Purple' = 57,
  'Tshirt Red' = 69,
  Unicorn = 118,
  Vietnamese = 109,
  Viking = 38,
  'Visor Green' = 74,
  'Visor Red' = 11,
  Wings = 120,
  Wink = 13,
  Winner = 1,
  Wizard = 27,
  Work = 135,
  'X Bucket Hat' = 19,
  'X Face Tattoo' = 18,
  'X Hoodie' = 9,
  Yellow = 30,

  'Lab Head' = 199,
  'Avalanche Hoodie' = 200,
  'Fast Food Cap' = 201,
  Builder = 202,
  'Christmas Hat' = 203,
  'Beard White' = 204,
  'Camo Background' = 205,
  'Lab Flask' = 207,
  'GLP Shirt' = 208,
  'GBC x Giorgio Balbi' = 209,
  'GBC x Wine Bottle Club' = 210,
  'Summer Buoy' = 211,
  Noodles = 212,
  High = 213,
  'Juice Head' = 214,
  'Ultra Sound BLAT' = 215,
  'Holographic Background' = 216,
  xMithical = 217,
  'Scary Night' = 218,
  Skeleton = 219,
  Birthday = 220,
  'Marine Shirt' = 221,
  'Giving Love' = 222,
  'Pepe Face' = 223,
  'Arbitrum Swag' = 224,
  'Holographic Badge' = 225,
  'Degen Ape' = 226,
  'NFT Paris Bandana' = 227,
  'Blueberry Fly' = 228
}

export enum AttributeBody {
  BLUEBERRY = AttributeMappings.Blueberry,
  GOLD = AttributeMappings.Gold,
  BLACK_AND_WHITE = AttributeMappings['Black and White'],
  LOSER = AttributeMappings.Looser,
  WINNER = AttributeMappings.Winner,
  NUDE = AttributeMappings.Nude
}

export enum AttributeExpression {
  ANGRY = AttributeMappings.Angry,
  BORED = AttributeMappings.Bored,
  CRYING = AttributeMappings.Crying,
  CUTE = AttributeMappings.Cute,
  DEAD = AttributeMappings.Dead,
  DIZZY = AttributeMappings.Dizzy,
  DUMB = AttributeMappings.Dumb,
  FEAR = AttributeMappings.Fear,
  HAPPY = AttributeMappings.Happy,
  LAUGHING = AttributeMappings.Laughing,
  SAD = AttributeMappings.Sad,
  SLEEPING = AttributeMappings.Sleeping,
  SUPRISED = AttributeMappings.Surprised,
  THINKING = AttributeMappings.Thinking,
  WINK = AttributeMappings.Wink,
  GOLD = AttributeMappings.Gold,
  BLACK_AND_WHITE = AttributeMappings['Black and White'],
  LOSER = AttributeMappings.Looser,
  WINNER = AttributeMappings.Winner,
  NUDE = AttributeMappings.Nude,

  HIGH = AttributeMappings.High
}

export enum AttributeClothes {
  ARMY_GREEN = AttributeMappings['Army Green'],
  ARMY_PINK = AttributeMappings['Army Pink'],
  BASKET = AttributeMappings.Basket,
  BASKETBALL_GREEN = AttributeMappings['Basketball Green'],
  BASKETBALL_RED = AttributeMappings['Basketball Red'],
  BATHROBE_GREY = AttributeMappings['Bathrobe Grey'],
  BATHROBE_ORANGE = AttributeMappings['Bathrobe Orange'],
  BEAR_FUR = AttributeMappings['Bear Fur'],
  BULL = AttributeMappings.Bull,
  CHAIN = AttributeMappings.Chain,
  CHEF = AttributeMappings.Chef,
  DAMAGED_SHIRT_GREY = AttributeMappings['Damaged Shirt Grey'],
  DAMAGED_SHIRT_PURPLE = AttributeMappings['Damaged Shirt Purple'],
  DEVIL = AttributeMappings.Devil,
  HAWAIIAN_SHIRT_ORANGE = AttributeMappings['Hawaiian Shirt Orange'],
  HAWAIIAN_SHIRT_YELLOW = AttributeMappings['Hawaiian Shirt Yellow'],
  HOODIE_BLUE = AttributeMappings['Hoodie Blue'],
  HOODIE_MULTICOLOR = AttributeMappings['Hoodie Multicolor'],
  HOODIE_PINK = AttributeMappings['Hoodie Pink'],
  KING_ROBE = AttributeMappings['King Robe'],
  NINJA = AttributeMappings.Ninja,
  OVERALLS_GREEN = AttributeMappings['Overalls Green'],
  OVERALLS_RED = AttributeMappings['Overalls Red'],
  PIRATE = AttributeMappings.Pirate,
  POLICE = AttributeMappings.Police,
  PUFFER_MULTICOLOR = AttributeMappings['Puffer Multicolor'],
  PUFFER_PURPLE = AttributeMappings['Puffer Purple'],
  PUFFER_YELLOW = AttributeMappings['Puffer Yellow'],
  SEXY_DOCTOR = AttributeMappings['Sexy Doctor'],
  SHIRT_BLUE = AttributeMappings['Shirt Blue'],
  SHIRT_YELLOW = AttributeMappings['Shirt Yellow'],
  SOCCER_JERSEY = AttributeMappings['Soccer Jersey'],
  SUIT_BLACK = AttributeMappings['Suit Black'],
  SUIT_PINK = AttributeMappings['Suit Pink'],
  SWEATER_GREY = AttributeMappings['Sweater Grey'],
  SWEATER_RED = AttributeMappings['Sweater Red'],
  TANKTOP_BLACK = AttributeMappings['Tank Top Black'],
  TANKTOP_WHITE = AttributeMappings['Tank Top White'],
  TSHIRT_GREEN = AttributeMappings['Tshirt Green'],
  TSHIRT_GREY = AttributeMappings['Tshirt Grey'],
  TSHIRT_ORANGE = AttributeMappings['Tshirt Orange'],
  TSHIRT_PURPLE = AttributeMappings['Tshirt Purple'],
  TSHIRT_RED = AttributeMappings['Tshirt Red'],
  WINGS = AttributeMappings.Wings,
  WIZARD = AttributeMappings.Wizard,
  WORK = AttributeMappings.Work,
  X_HOODIE = AttributeMappings['X Hoodie'],
  GOLD = AttributeMappings.Gold,
  BLACK_AND_WHITE = AttributeMappings['Black and White'],
  LOSER = AttributeMappings.Looser,
  WINNER = AttributeMappings.Winner,
  NUDE = AttributeMappings.Nude,

  // lab
  AVALANCHE_HOODIE = AttributeMappings['Avalanche Hoodie'],
  GLP_SHIRT = AttributeMappings['GLP Shirt'],
  SUMMER_BUOY = AttributeMappings['Summer Buoy'],
  ULTRASOUND_BAT = AttributeMappings['Ultra Sound BLAT'],
  SKELETON = AttributeMappings.Skeleton,
  MARINE_SHIRT = AttributeMappings['Marine Shirt'],
  GIVING_LOVE = AttributeMappings['Giving Love'],
  ARBITRUM_SWAG = AttributeMappings['Arbitrum Swag']
}

export enum AttributeFaceAccessory {
  BEARD_GREEN = AttributeMappings['Beard Green'],
  BEARD_MULTICOLOR = AttributeMappings['Beard Multicolor'],
  BEARD_PINK = AttributeMappings['Beard Pink'],
  BLIND = AttributeMappings.Blind,
  BUBBLEGUM = AttributeMappings.Bubblegum,
  CIGARETTE = AttributeMappings.Cigarette,
  CLOWN = AttributeMappings.Clown,
  EYEPATCH = AttributeMappings.Eyepatch,
  FLOWER_SUNGLASSES_BLUE = AttributeMappings['Flower Sunglasses Blue'],
  FLOWER_SUNGLASSES_GREEN = AttributeMappings['Flower Sunglasses Green'],
  GRILLZ_GOLD = AttributeMappings['Grillz Gold'],
  GRILLZ_MULTICOLOR = AttributeMappings['Grillz Multicolor'],
  GRILLZ_SILVER = AttributeMappings['Grillz Silver'],
  HEART_GLASSES = AttributeMappings['Heart Glasses'],
  MEDICAL_MASK = AttributeMappings['Medical Mask'],
  NEIRD = AttributeMappings.Neird,
  NINJA = AttributeMappings.Ninja,
  PIPE = AttributeMappings.Pipe,
  PIXEL_GLASSES = AttributeMappings['Pixel Glasses'],
  RED_LASER = AttributeMappings['Red Laser'],
  RICH = AttributeMappings.Rich,
  SKI_SUNGLASSES_BLUE = AttributeMappings['Ski Sunglasses Blue'],
  SKI_SUNGLASSES_PINK = AttributeMappings['Ski Sunglasses Pink'],
  SUNGLASSES_GREEN = AttributeMappings['Sunglasses Green'],
  SUNGLASSES_RED = AttributeMappings['Sunglasses Red'],
  X_FACE_TATTOO = AttributeMappings['X Face Tattoo'],
  GOLD = AttributeMappings.Gold,
  BLACK_AND_WHITE = AttributeMappings['Black and White'],
  LOSER = AttributeMappings.Looser,
  WINNER = AttributeMappings.Winner,
  NUDE = AttributeMappings.Nude,

  // lab
  BEARD_WHITE = AttributeMappings['Beard White'],
  NOODLES = AttributeMappings.Noodles,
  PEPE_FACE = AttributeMappings['Pepe Face'],
  NFT_PARIS_BANDANA = AttributeMappings['NFT Paris Bandana']
}

export enum AttributeHat {
  AFRO_GREEN = AttributeMappings['Afro Green'],
  AFRO_MULTICOLOR = AttributeMappings['Afro Multicolor'],
  AFRO_PINK = AttributeMappings['Afro Pink'],
  ARMY_HELMET = AttributeMappings['Army Helmet'],
  ARROW = AttributeMappings.Arrow,
  BEANIE_GREY = AttributeMappings['Beanie Grey'],
  BEANIE_RED = AttributeMappings['Beanie Red'],
  BEAR_CAP = AttributeMappings['Bear Cap'],
  BONE = AttributeMappings.Bone,
  BOWTIE_GREEN = AttributeMappings['Bowtie Green'],
  BOWTIE_PINK = AttributeMappings['Bowtie Pink'],
  BRAIN = AttributeMappings.Brain,
  BUCKET_HAT_GREEN = AttributeMappings['Bucket Hat Green'],
  BUCKET_HAT_PURPLE = AttributeMappings['Bucket Hat Purple'],
  BUCKET_HAT_RED = AttributeMappings['Bucket Hat Red'],
  BULL_HORNS = AttributeMappings['Bull Horns'],
  CAP_BLUE = AttributeMappings['Cap Blue'],
  CAP_PINK = AttributeMappings['Cap Pink'],
  CAP_YELLOW = AttributeMappings['Cap Yellow'],
  CHEF = AttributeMappings.Chef,
  DEVIL_HORNS = AttributeMappings['Devil Horns'],
  DOUBLE_BUN_BLUE = AttributeMappings['Double Bun Blue'],
  DOUBLE_BUN_PURPLE = AttributeMappings['Double Bun Purple'],
  DURAG_BLUE = AttributeMappings['Durag Blue'],
  DURAG_GREY = AttributeMappings['Durag Grey'],
  DURAG_ORANGE = AttributeMappings['Durag Orange'],
  FLOWER_BLUE = AttributeMappings['Flower Blue'],
  FLOWER_GREEN = AttributeMappings['Flower Green'],
  GREEN_CANDLE = AttributeMappings['Green Candle'],
  HALO = AttributeMappings.Halo,
  HEADBAND_PURPLE = AttributeMappings['Headband Purple'],
  HEADBAND_YELLOW = AttributeMappings['Headband Yellow'],
  KING = AttributeMappings.King,
  MOHAWK_GREEN = AttributeMappings['Mohawk Green'],
  MOHAWK_RED = AttributeMappings['Mohawk Red'],
  NINJA = AttributeMappings.Ninja,
  PIRATE = AttributeMappings.Pirate,
  POLICE = AttributeMappings.Police,
  RUGPULL = AttributeMappings.Rugpull,
  SOMBRERO = AttributeMappings.Sombrero,
  STITCHES = AttributeMappings.Stitches,
  STRAW_HAT = AttributeMappings['Straw Hat'],
  TOP_HAT = AttributeMappings['Top Hat'],
  UNICORN = AttributeMappings.Unicorn,
  VIETNAMESE = AttributeMappings.Vietnamese,
  VIKING = AttributeMappings.Viking,
  VISOR_GREEN = AttributeMappings['Visor Green'],
  VISOR_RED = AttributeMappings['Visor Red'],
  WIZARD = AttributeMappings.Wizard,
  X_BUCKET_HAT = AttributeMappings['X Bucket Hat'],
  GOLD = AttributeMappings.Gold,
  BLACK_AND_WHITE = AttributeMappings['Black and White'],
  LOSER = AttributeMappings.Looser,
  WINNER = AttributeMappings.Winner,
  NUDE = AttributeMappings.Nude,

  // lab
  LAB_HEAD = AttributeMappings['Lab Head'],
  CHRISTMAS_HAT = AttributeMappings['Christmas Hat'],
  FAST_FOOD_CAP = AttributeMappings['Fast Food Cap'],
  LAB_FLASK = AttributeMappings['Lab Flask'],
  GBC_WINE_BOTTLE_CLUB = AttributeMappings['GBC x Wine Bottle Club'],
  JUICE_HEAD = AttributeMappings['Juice Head'],
  // UZUMAKI = IAttributeMappings.Uzumaki,
  XMITHICAL = AttributeMappings.xMithical,
  BIRTHDAY = AttributeMappings.Birthday,
  DEGEN_APE = AttributeMappings['Degen Ape']
}

export enum AttributeBackground {
  RED = AttributeMappings.Red,
  BLUE = AttributeMappings.Blue,
  GREEN = AttributeMappings.Green,
  GREY = AttributeMappings.Grey,
  ORANGE = AttributeMappings.Orange,
  PINK = AttributeMappings.Pink,
  PURPLE = AttributeMappings.Purple,
  YELLOW = AttributeMappings.Yellow,
  GOLD = AttributeMappings.Gold,
  BLACK_AND_WHITE = AttributeMappings['Black and White'],
  LOSER = AttributeMappings.Looser,
  WINNER = AttributeMappings.Winner,
  NUDE = AttributeMappings.Nude,

  CAMO = AttributeMappings['Camo Background'],
  GIORGIO_BALBI_BG = AttributeMappings['GBC x Giorgio Balbi'],
  HOLOGRAPHIC_BG = AttributeMappings['Holographic Background'],
  SCARY_NIGHT = AttributeMappings['Scary Night']
}

export enum AttributeBadge {
  HOLOGRAPHIC_BADGE = AttributeMappings['Holographic Badge'],
  BLUEBERRY_FLY = AttributeMappings['Blueberry Fly']
}

export type IBerryDisplayTupleMap = [
  AttributeBackground,
  AttributeClothes,
  AttributeBody,
  AttributeExpression,
  AttributeFaceAccessory,
  AttributeHat,
  AttributeBadge
]

export type ILabAttributeOptions =
  | typeof AttributeBackground
  | typeof AttributeClothes
  | typeof AttributeHat
  | typeof AttributeFaceAccessory
  | typeof AttributeBadge

export type ISvgPartsMap = [
  { [p in AttributeBackground]: string },
  { [p in AttributeClothes]: string },
  { [p in AttributeBody]: string },
  { [p in AttributeExpression]: string },
  { [p in AttributeFaceAccessory]: string },
  { [p in AttributeHat]: string },
  { [p in AttributeBadge]: string }
]
