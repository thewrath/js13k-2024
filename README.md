# JS13k - 2024 - **Match 13s 🕐**

> By Thomas Le Goff

## Credits

- [LittleJS 🚂](https://github.com/KilledByAPixel/LittleJS)
- [Assets](https://opengameart.org/content/match-3-assets)

## **Basic concept**
‘Match 13s’ is a match-3 game inspired by “Jewel Quest” with a unique mechanic linked to the number 13. 

Players must wager on the number of combos they can perform in a given time frame, with power-ups stacking up and having to be performed in order of appearance, including positive and negative effects.

## Game mechanics

### **1. Setting up and Performing Combos
- Loop of play**: each game consists of a sequence of two phases:
    - Bet Selection:** The player bets on the number of combos he/she can make in the allotted time.
    - Completing the combos:** The player must reach his wager within the given time. If he succeeds, a special reward is triggered; if not, he is penalised.
- Imputed time per Difficulty Level:**
  - Easy:** 18 seconds to make the bet.
  - Medium:** 13 seconds to complete bet.
  - Difficult:** 10 seconds to make the bet.

### **2. Coin Anticipation
- Next Coins Preview:** Displays the next 3 to 5 coins that will fall, allowing better planning of moves.
- Power-up prediction:** Allows you to see all the coins that will fall during a limited period.
- Gravity Indicators:** Arrows or lights indicating where and which gems will fall, helping to manage combos.
- Preview Bar:** Shows the next line of gems before they fall, for quick adjustment.

### **3. Power-ups**
Power-ups are stacked at the bottom of the screen and must be used in the order they appear. Some have negative effects, so players need to plan their use carefully.

#### **Proposed Power-ups (by ChatGPT):**
- Thirteenth Hour:** Slows down time for 13 seconds.
- Lucky 13:** Converts 13 random gems into special gems.
- Hexed Tiles:** 13 tiles become indestructible for 13 moves.
- Thirteen Strike:** Destroys exactly 13 tiles selected by the player.

### **4. Obtaining Power-ups
- Power-ups can appear as rewards after completing particularly successful combos or specific challenges. They can also be found by destroying special gems or objects hidden on the board.
- In-Game Purchases:** Power-ups can be purchased with in-game credits or coins that the player earns while playing. These credits can be accumulated by completing levels or special missions.
- Challenges and Rewards:** Some power-ups are unlocked by completing daily challenges or missions. These challenges may include objectives such as completing a certain number of combos or accumulating a specific score.
- Special Events:** Exclusive power-ups may be offered during special events or limited in-game promotions, providing players with unique opportunities to acquire powerful or rare abilities.

### **5. Managing Power-ups** **Stacking and Execution Order
- Power-ups accumulate at the bottom of the screen. The player must activate them in the order in which they appear, which includes negative effects.
- Strategy and Tension:** The player must manage the constraint of activating power-ups with negative effects while optimising positive power-ups to maximise their score.
- Variability and Rewards:** Negative power-ups increase challenge and replayability. Rewards are adjusted according to the risk taken by the player.