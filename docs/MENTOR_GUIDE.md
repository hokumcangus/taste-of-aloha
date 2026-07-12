# 🌺 Mentor Guide: Your Pipeline to Success

Hey there! I hear you're 19, getting into the flow of things, and want to understand how we keep this "Taste of Aloha" project running smoothly. As your mentor, I'm here to break it down simply.

Think of our code like a recipe for the perfect Spam Musubi. We want to make sure it tastes the same every time, no matter who's in the kitchen.

---

## 1. What is a "Pipeline"? (The Safety Net)
Imagine you're about to post a video to TikTok. Before it goes live, you check the lighting, the sound, and make sure there's no spinach in your teeth. 

In coding, a **CI/CD Pipeline** (Continuous Integration/Continuous Deployment) is that final check. Every time you push code to GitHub:
1. **The Robot Wakes Up:** GitHub Actions starts a "runner" (a virtual computer).
2. **Environment Setup:** It installs Node.js and all our project's "ingredients" (dependencies).
3. **Linting (The Style Check):** It makes sure the code isn't messy and follows our rules.
4. **Testing (The Taste Test):** It runs our automated tests to make sure we didn't break anything.

If any of these fail, the "pipeline" goes red ❌. We don't merge red code. We keep it green ✅ to keep the vibes good!

## 2. Our Project Structure (The Monorepo)
We have a "Monorepo," which just means the **Web** (what you see) and the **Backend** (the brain) live in one big folder.
- `apps/web`: React & Vite. This is the front-of-house.
- `apps/backend`: Express & Prisma. This is the kitchen.

## 3. The Config Files (The Rulebooks)
- **`package.json`**: The shopping list. It tells the computer what libraries we need.
- **`eslint.config.js`**: The style guide. It's like a grammar checker for code. It'll yell at you if you leave an unused variable lying around.
- **`vitest.config.js` / `jest.config.js`**: The test instructors. They know how to run our "taste tests."
- **`.github/workflows/test.yml`**: The manager. It tells GitHub exactly which steps to take when you push code.

## 4. How to Keep the Vibes Good 🤙
Before you push your code, run these locally to make sure you're good to go:

- `npm run lint`: Fixes your "grammar" and style.
- `npm run dev:test`: Runs all the tests for both Web and Backend.

If both pass, you're ready to push!

## 5. JavaScript or TypeScript? (The Language)
You might wonder if we're using JavaScript (JS) or TypeScript (TS). Here's the deal:
- **Current State:** JavaScript (JS/JSX). The core logic is written in standard JavaScript.
- **Setup:** Hybrid. We have the tools for TypeScript (like `typescript` and `ts-node` in `package.json`), but we aren't strictly using it everywhere yet.
- **Why it matters:** TypeScript is like having a "super-check" on your code before it even runs. For now, we're sticking to JS to keep it simple, but we're ready to level up when you are!

## 6. Common Issues & Fixes (The Troubleshooting)
- **"Cannot resolve environment variable: DATABASE_URL" during build**: This happens because Prisma needs to know where the database is, even just to "generate" the client. On Vercel, we don't always have the database connected during the build step. We fix this by using `cross-env` to give it a "dummy" URL so it can finish its work without complaining, whether you're on Windows or Linux! **Never replace this script with `echo 'No build needed'` or it will break your deployment!**
- **"No Output Directory named 'dist' found" on Vercel**: This is a classic monorepo mix-up! Vercel starts building from the root, but our web app's build output ends up in `apps/web/dist`. We told Vercel exactly where to look by updating the `outputDirectory` in our `vercel.json`. It's like giving someone the exact room number instead of just the building address. 🏨

## 8. From Button to Database: The Journey of a Click 🚀
Ever wondered what happens when you click a button on the website and data magically appears? It's like ordering at a drive-thru. Here’s the step-by-step "route" your menu data takes:

### Step 1: The Customer (The Frontend)
In `apps/web/src/pages/Menu.jsx`, we use a "Hook" called `useEffect` to say: *"As soon as this page loads, go get the menu!"*
- It calls `dispatch(fetchMenuItems())`.

### Step 2: The Order Taker (Redux Store)
In `apps/web/src/store/slices/menuSlice.js`, the `fetchMenuItems` "thunk" (an async function) wakes up.
- It asks the `menuService` to do the heavy lifting.

### Step 3: The Delivery Driver (API Service)
In `apps/web/src/services/menuService.js`, the code makes a request to our backend:
- `apiClient.get('/api/menu')`. This is like the driver heading to the kitchen.

### Step 4: The Kitchen Door (Express Routes)
The backend `index.js` sees the request and sends it to `apps/backend/src/routes/menuRoutes.js`.
- It says: *"Oh, you're looking for the menu? Talk to the Menu Controller!"*

### Step 5: The Head Chef (The Controller)
In `apps/backend/src/controllers/menuController.js`, the `getAllMenus` function runs.
- It doesn't cook the food itself; it tells the **Model** to get the ingredients.

### Step 6: The Pantry (The Model & Prisma)
In `apps/backend/src/models/menuModel.js`, we use **Prisma** to talk to the database:
- `prisma.menu.findMany()`. Prisma is like the pantry organizer that knows exactly where everything is in the database.

### Step 7: The Meal is Served!
The data travels all the way back up the chain until it hits your screen in `Menu.jsx`. 🤙

---

## 9. Prisma Commands (The Database Magic) 🪄
Since we're using Prisma to talk to the database, you'll need these commands to keep everything in sync:

- `npm --workspace backend run db:generate`: **The Translator.** Run this if you change `schema.prisma` or if your code editor is yelling about missing types. It updates the Prisma Client.
- `npm --workspace backend run db:migrate`: **The Architect.** Run this to apply your schema changes to the actual database.
- `npm --workspace backend run db:studio`: **The Viewer.** This opens a cool dashboard in your browser so you can see your data without writing SQL. 

## 10. Summary for the Hustle
- **Red Pipeline?** Don't panic. Check the logs, fix the error, and push again.
- **Clean Code?** Use `npm run format` to keep everything looking sharp.
- **Testing?** It's not a chore; it's your insurance policy so you don't get a 2 AM call that the site is down.
- **Prisma?** Use `db:generate` when you change the recipe, and `db:studio` to check the fridge. 🍳
- **JS vs TS?** We're mostly JavaScript, but with the "safety gear" for TypeScript ready to go.

You've got this! Keep the code clean and the aloha spirit high. 🌺
