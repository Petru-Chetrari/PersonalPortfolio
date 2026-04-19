<script lang="ts">
    import { prefsStore, type UserPrefs } from '../lib/preferencesStore';

    let { initPrefs } = $props<{ initPrefs: UserPrefs }>();

    $effect(() => {
        prefsStore.init(initPrefs);
    });
</script>
