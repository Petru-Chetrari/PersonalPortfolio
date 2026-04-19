/// <reference path="../.astro/types.d.ts" />

type ThemePref = 'dark' | 'light' | 'system';
type ReducedMotionPref = 'true' | 'false' | 'system';

interface UserPrefs {
    theme: ThemePref;
    language: string;
    hiringMode: boolean;
    reducedMotion: ReducedMotionPref;
}

declare namespace App {
    interface Locals {
        prefs: UserPrefs;
    }
}
