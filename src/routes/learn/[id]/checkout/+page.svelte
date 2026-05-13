<!-- src/routes/learn/[id]/checkout/+page.svelte -->
<script lang="ts">
    import type { PageData, ActionData } from "./$types";
    import { enhance } from "$app/forms";
    import Header from "$lib/components/Header.svelte";
    import Footer from "$lib/components/Footer.svelte";
    import Sidebar from "$lib/components/Sidebar.svelte";

    let { data, form }: { data: PageData; form: ActionData } = $props();
    const c = $derived(data.course);
    let paying = $state(false);
    let method = $state<"card" | "mono" | "privat">("card");
</script>

<svelte:head><title>Оплата — {c?.title} — LvUp</title></svelte:head>

<style>
.page{min-height:100vh;background:var(--bg);color:var(--text);font-family:'Manrope',sans-serif;display:flex;flex-direction:column;}
.body{display:flex;flex:1;}
.main{flex:1;padding:32px 40px 64px;max-width:1000px;margin:0 auto;}
.bc{font-size:13px;color:var(--text-dim);margin-bottom:12px;display:flex;gap:4px;}
.bc a{color:var(--text-muted);text-decoration:none;}
.bc a:hover{color:#3E83FF;}
.h1{font-size:28px;font-weight:800;color:var(--text);margin-bottom:28px;}
:global(.light-mode) .h1{color:#0a0e1a;}

.layout{display:grid;grid-template-columns:1fr 360px;gap:24px;align-items:start;}
@media(max-width:860px){.layout{grid-template-columns:1fr;}}

/* Left */
.card{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:28px;margin-bottom:20px;}
:global(.light-mode) .card{background:#fff;border-color:rgba(10,14,26,.08);}
.card-title{font-size:17px;font-weight:700;color:var(--text);margin-bottom:18px;display:flex;align-items:center;gap:9px;}
:global(.light-mode) .card-title{color:#0a0e1a;}
.s-bar{width:4px;height:17px;background:#3E83FF;border-radius:3px;flex-shrink:0;}

/* Payment methods */
.methods{display:flex;flex-direction:column;gap:10px;margin-bottom:20px;}
.method{display:flex;align-items:center;gap:14px;padding:14px 16px;border-radius:10px;border:2px solid var(--border);cursor:pointer;transition:border-color .12s,background .12s;}
.method:hover{border-color:rgba(62,131,255,.4);}
.method.selected{border-color:#3E83FF;background:rgba(62,131,255,.06);}
:global(.light-mode) .method{border-color:rgba(10,14,26,.1);}
:global(.light-mode) .method.selected{background:rgba(62,131,255,.05);}
.method-icon{width:42px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:18px;background:rgba(62,131,255,.1);flex-shrink:0;}
.method-label{font-size:14px;font-weight:600;color:var(--text);}
.method-sub{font-size:12px;color:var(--text-muted);margin-top:1px;}
:global(.light-mode) .method-label{color:#0a0e1a;}
.method-radio{margin-left:auto;width:18px;height:18px;border-radius:50%;border:2px solid var(--border);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.method-radio.on{border-color:#3E83FF;background:#3E83FF;}
.method-radio.on::after{content:'';width:6px;height:6px;border-radius:50%;background:#fff;}

/* Card form */
.card-form{display:flex;flex-direction:column;gap:12px;}
.field label{display:block;font-size:12px;color:var(--text-muted);margin-bottom:5px;font-weight:600;}
:global(.light-mode) .field label{color:rgba(10,14,26,.55);}
.inp{width:100%;padding:11px 14px;border-radius:9px;border:1.5px solid var(--border);background:var(--bg);color:var(--text);font-size:15px;font-family:inherit;outline:none;box-sizing:border-box;transition:border-color .12s;}
.inp:focus{border-color:#3E83FF;}
:global(.light-mode) .inp{background:#f8faff;border-color:rgba(10,14,26,.12);color:#0a0e1a;}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:12px;}

/* Right: order summary */
.summary{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:24px;position:sticky;top:20px;}
:global(.light-mode) .summary{background:#fff;border-color:rgba(10,14,26,.08);box-shadow:0 4px 20px rgba(0,0,0,.07);}
.s-title{font-size:16px;font-weight:700;color:var(--text);margin-bottom:16px;}
:global(.light-mode) .s-title{color:#0a0e1a;}
.course-row{display:flex;gap:12px;align-items:flex-start;margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid var(--border);}
:global(.light-mode) .course-row{border-color:rgba(10,14,26,.08);}
.course-cover{width:70px;height:50px;border-radius:7px;object-fit:cover;background:linear-gradient(135deg,#0d1b4a,#1a3a7a);flex-shrink:0;overflow:hidden;}
.course-cover img{width:100%;height:100%;object-fit:cover;}
.course-name{font-size:14px;font-weight:600;color:var(--text);line-height:1.4;}
:global(.light-mode) .course-name{color:#0a0e1a;}
.course-meta{font-size:12px;color:var(--text-muted);margin-top:2px;}

.price-rows{display:flex;flex-direction:column;gap:8px;margin-bottom:16px;}
.price-row{display:flex;justify-content:space-between;font-size:14px;}
.price-label{color:var(--text-muted);}
:global(.light-mode) .price-label{color:rgba(10,14,26,.55);}
.price-val{font-weight:600;color:var(--text);}
:global(.light-mode) .price-val{color:#0a0e1a;}
.price-total{font-size:20px;font-weight:800;color:var(--text);display:flex;justify-content:space-between;padding-top:12px;border-top:1px solid var(--border);}
:global(.light-mode) .price-total{color:#0a0e1a;border-color:rgba(10,14,26,.08);}

.btn-pay{width:100%;padding:14px;border-radius:10px;border:none;background:#3E83FF;color:#fff;font-size:16px;font-weight:700;font-family:inherit;cursor:pointer;transition:background .12s;margin-top:16px;margin-bottom:10px;}
.btn-pay:hover:not(:disabled){background:#2d6fe0;}
.btn-pay:disabled{opacity:.5;cursor:not-allowed;}

.secure{display:flex;align-items:center;justify-content:center;gap:6px;font-size:12px;color:var(--text-dim);}
:global(.light-mode) .secure{color:rgba(10,14,26,.4);}

.what-you-get{margin-top:16px;padding-top:16px;border-top:1px solid var(--border);}
:global(.light-mode) .what-you-get{border-color:rgba(10,14,26,.08);}
.wyg-title{font-size:13px;font-weight:700;color:var(--text);margin-bottom:10px;}
:global(.light-mode) .wyg-title{color:#0a0e1a;}
.wyg-item{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text-muted);margin-bottom:6px;}
.wyg-item svg{color:#4ADE80;flex-shrink:0;}
:global(.light-mode) .wyg-item{color:rgba(10,14,26,.6);}

.err{font-size:13px;color:#f85149;margin-top:8px;}
</style>

<div class="page">
    <Header />
    <div class="body">
        <Sidebar user={data.user} />
        <main class="main">
            <div class="bc">
                <a href="/learn">Курси</a><span>/</span>
                <a href="/learn/{c.id}">{c.title}</a><span>/</span>
                <span style="color:#3E83FF;">Оплата</span>
            </div>
            <h1 class="h1">Оформлення замовлення</h1>

            <div class="layout">
                <!-- LEFT -->
                <div>
                    <!-- Payment method -->
                    <div class="card">
                        <div class="card-title"><span class="s-bar"></span>Спосіб оплати</div>
                        <div class="methods">
                            {#each [
                                { id: 'card',   icon: '💳', label: 'Банківська карта',  sub: 'Visa, Mastercard' },
                                { id: 'mono',   icon: '🖤', label: 'Monobank',          sub: 'Оплата через додаток' },
                                { id: 'privat', icon: '🟢', label: 'PrivatBank',        sub: 'Оплата через Privat24' },
                            ] as m}
                                <div class="method" class:selected={method === m.id} onclick={() => method = m.id as any}
                                     role="radio" aria-checked={method === m.id} tabindex="0"
                                     onkeydown={(e) => e.key === 'Enter' && (method = m.id as any)}>
                                    <div class="method-icon">{m.icon}</div>
                                    <div>
                                        <div class="method-label">{m.label}</div>
                                        <div class="method-sub">{m.sub}</div>
                                    </div>
                                    <div class="method-radio" class:on={method === m.id}></div>
                                </div>
                            {/each}
                        </div>

                        <!-- Card form -->
                        {#if method === 'card'}
                            <form class="card-form" method="POST" action="?/pay"
                                use:enhance={() => { paying = true; return async ({update}) => { await update(); paying = false; }; }}>
                                <div class="field">
                                    <label for="cardnum">Номер картки</label>
                                    <input id="cardnum" name="cardNumber" class="inp" type="text"
                                        placeholder="0000 0000 0000 0000" maxlength="19" required />
                                </div>
                                <div class="field">
                                    <label for="holder">Ім'я власника</label>
                                    <input id="holder" name="holder" class="inp" type="text"
                                        placeholder="IVAN SHEVCHENKO" required />
                                </div>
                                <div class="row2">
                                    <div class="field">
                                        <label for="expiry">Термін дії</label>
                                        <input id="expiry" name="expiry" class="inp" type="text"
                                            placeholder="MM/YY" maxlength="5" required />
                                    </div>
                                    <div class="field">
                                        <label for="cvv">CVV</label>
                                        <input id="cvv" name="cvv" class="inp" type="password"
                                            placeholder="•••" maxlength="3" required />
                                    </div>
                                </div>
                                {#if form?.error}<div class="err">{form.error}</div>{/if}
                                <button type="submit" class="btn-pay" disabled={paying}>
                                    {paying ? "Обробка..." : `Оплатити ${c.price} грн`}
                                </button>
                            </form>
                        {:else}
                            <form method="POST" action="?/pay"
                                use:enhance={() => { paying = true; return async ({update}) => { await update(); paying = false; }; }}>
                                <input type="hidden" name="method" value={method} />
                                <button type="submit" class="btn-pay" disabled={paying}>
                                    {paying ? "Перенаправлення..." : `Оплатити через ${method === 'mono' ? 'Monobank' : 'PrivatBank'}`}
                                </button>
                            </form>
                        {/if}

                        <div class="secure">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>
                            Захищена оплата · SSL шифрування
                        </div>
                    </div>
                </div>

                <!-- RIGHT: order summary -->
                <div>
                    <div class="summary">
                        <div class="s-title">Ваше замовлення</div>

                        <div class="course-row">
                            <div class="course-cover">
                                {#if c.coverUrl}<img src={c.coverUrl} alt={c.title} />{/if}
                            </div>
                            <div>
                                <div class="course-name">{c.title}</div>
                                <div class="course-meta">{c.modules.length} модулів · Довічний доступ</div>
                            </div>
                        </div>

                        <div class="price-rows">
                            <div class="price-row">
                                <span class="price-label">Ціна курсу</span>
                                <span class="price-val">{c.price} грн</span>
                            </div>
                            <div class="price-row">
                                <span class="price-label">Знижка</span>
                                <span class="price-val" style="color:#4ADE80;">—0 грн</span>
                            </div>
                        </div>

                        <div class="price-total">
                            <span>Разом</span>
                            <span>{c.price} грн</span>
                        </div>

                        <div class="what-you-get">
                            <div class="wyg-title">Що входить у курс:</div>
                            {#each [
                                `${c.modules.length} модулів з відео`,
                                "Конспекти до кожного уроку",
                                "Тести для перевірки знань",
                                "Сертифікат після завершення",
                                "Довічний доступ до матеріалів",
                            ] as item}
                                <div class="wyg-item">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                        <polyline points="20 6 9 17 4 12"/>
                                    </svg>
                                    {item}
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
    <Footer />
</div>
