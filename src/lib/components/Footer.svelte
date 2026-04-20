<!-- src/lib/components/Footer.svelte -->
<script lang="ts">
    import Logo from '$lib/components/Logo.svelte';

    const mainLinks = [
        {label:'Про нас', href:'/about'},
        {label:'Всі події', href:'/events'},
        {label:'Всі курси', href:'/courses'},
        {label:'Новини', href:'/news'},
        {label:'Амбасадори', href:'/ambassadors'},
    ];

    const tournamentLinks = [
        {label:'Цьогорічні турніри', href:'/tourments'},
        {label:'Звіти по турнірам', href:'/tourments/reports'},
        {label:'Журі', href:'/tourments/jury'},
        {label:'Турнір з програмування', href:'/tourments/programming'},
    ];
</script>

<footer>
    <div style="background:var(--footer-bg,#111116); border-top:1px solid var(--border,rgba(255,255,255,0.05)); transition:background 0.25s;">
        <div style="max-width:1280px; margin:0 auto; padding:3rem 2rem; display:grid; grid-template-columns:1fr 1fr 1fr 160px; gap:2.5rem;">

            <div>
                <p style="font-size:24px; font-weight:700; color:var(--text,#fff); margin-bottom:1rem; letter-spacing:-0.01em;">ГОЛОВНЕ</p>
                <ul style="list-style:none; display:flex; flex-direction:column; gap:8px;">
                    {#each mainLinks as item}
                        <li><a href={item.href} style="font-size:16px; color:var(--text-muted); text-decoration:none; transition:color 0.15s;">{item.label}</a></li>
                    {/each}
                </ul>
            </div>

            <div>
                <p style="font-size:24px; font-weight:700; color:var(--text,#fff); margin-bottom:1rem; letter-spacing:-0.01em;">ТУРНІРИ</p>
                <ul style="list-style:none; display:flex; flex-direction:column; gap:8px;">
                    {#each tournamentLinks as item}
                        <li><a href={item.href} style="font-size:16px; color:var(--text-muted); text-decoration:none; transition:color 0.15s;">{item.label}</a></li>
                    {/each}
                </ul>
            </div>

            <div>
                <p style="font-size:24px; font-weight:700; color:var(--text,#fff); margin-bottom:1rem; letter-spacing:-0.01em;">СПОСОБИ ЗВ'ЯЗКУ</p>
                <ul style="list-style:none; display:flex; flex-direction:column; gap:8px;">
                    <li><a href="mailto:levelUp@gmail.com" style="font-size:16px; color:var(--text-muted); text-decoration:none;">levelUp@gmail.com</a></li>
                    <li><a href="mailto:levelUptournaments@gmail.com" style="font-size:16px; color:var(--text-muted); text-decoration:none;">levelUptournaments@gmail.com</a></li>
                </ul>
            </div>

            <div style="display:flex; align-items:flex-start; justify-content:flex-end;">
                <a href="/" aria-label="LvlUp — Головна"><Logo size={64} /></a>
            </div>
        </div>
    </div>

    <div style="background:var(--footer-bar,#0D0D12); border-top:1px solid var(--border,rgba(255,255,255,0.05)); transition:background 0.25s;">
        <div style="max-width:1280px; margin:0 auto; padding:1.1rem 2rem; display:flex; flex-wrap:wrap; align-items:center; justify-content:center; gap:0.75rem;">
            <a href="/privacy" style="font-size:16px; color:var(--text-dim); text-decoration:none;">Політика конфіденційності</a>
            <span style="color:var(--text-dim); font-size:12px;">|</span>
            <a href="/terms" style="font-size:16px; color:var(--text-dim); text-decoration:none;">Умови співпраці</a>
            <span style="color:var(--text-dim); font-size:12px;">|</span>
            <span style="font-size:16px; color:var(--text-dim);">© 2026</span>
        </div>
    </div>
</footer>
