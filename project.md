# Grimoire: DM Tools Application

## Project Overview

Grimoire is a comprehensive, web-based Dungeon Master (DM) toolkit designed to assist in running tabletop roleplaying games (like D&D 5e). Built with modern web technologies including React 19, TypeScript, and Vite, the application features a custom DnD-themed UI utilizing Material Design principles and CSS Modules. It also features a dark mode and integrated backend support via Cloudflare Pages and Functions.

The application serves as a centralized hub for managing campaigns, providing quick access to audio, rules, player information, and various compendiums.

## Features

### 1. Soundboard
A feature-rich DM Soundboard for managing and playing ambient music and sound effects during sessions. 
- Organizes audio tracks into categories (e.g., combat, exploration, atmosphere).
- Streams high-quality audio files securely.
- Integrates with a Cloudflare R2 private bucket via a Cloudflare Pages Functions proxy to fetch and serve audio files efficiently.

### 2. Player Sheets
A tool for tracking and managing player character sheets.
- View and manage essential character stats and information.
- Import existing character sheets for quick setup.
- Export character data to JSON files for backup and sharing.

### 3. Rules (Quick Reference)
A handy, built-in reference guide for core game mechanics to speed up gameplay.
- **Vocabulary:** Defines key terms like AC, DC, HP, Advantage/Disadvantage, and Checks.
- **Combat:** Provides an overview of combat mechanics, initiative, turn structure (Action, Bonus Action, Movement, Reaction), and attack/damage rolls.
- **Saving Throws:** Explains saving throws, spell save DCs calculations, and provides examples.

### 4. Spells
A compendium for quick lookup and management of spells. Allows the DM to reference spell details, casting times, ranges, and effects without flipping through books.

### 5. Weapons
A reference section and management tool for various in-game weapons (including firearms and standard fantasy weapons), tracking their damage, properties, and types.

### 6. Planned Features (Placeholders)
The application architecture includes space for several upcoming features:
- **Bestiary:** A database of monsters, NPCs, and enemies with stat blocks.
- **Items:** A catalog of magical items, gear, and loot.
- **Maps / Interactive Map:** Tools for viewing and interacting with campaign maps and dungeon layouts.
- **NPCs & Encounters:** A tracker for non-player characters and active combat encounters.

## Technology Stack
- **Frontend Framework:** React 19, Vite
- **Language:** TypeScript
- **Styling:** Vanilla CSS & CSS Modules (Custom DnD Material Design theme)
- **Backend/Hosting:** Cloudflare Pages, Cloudflare Functions, Cloudflare R2 (for private audio hosting)
- **Icons:** Lucide React
