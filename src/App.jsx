import { useEffect, useRef, useState } from 'react';
import { burgerGroups, burgerPicks, money, pizzaGroups, pizzaPicks } from './menu.js';
import { useHeroMotion, useReferenceMotion } from './useReferenceMotion.js';

const asset = name => `/assets/${name}`;
const galleryAlts = ['Friends sharing a pizza', 'A night out with pizza and friends', 'Fresh pizza ready to share', 'A golden cheese pull', 'Pizza straight from the oven', 'Good times around the table'];

function Arrow({ direction = 'right' }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d={direction === 'left' ? 'M19 12H5m6-6-6 6 6 6' : 'M5 12h14m-6-6 6 6-6 6'} /></svg>;
}

function Header({ mode, onMode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('home');
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    }, { rootMargin: '-15% 0px -60% 0px' });
    document.querySelectorAll('[data-nav-section]').forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  function changeMode(next) {
    onMode(next);
    setMenuOpen(false);
    document.getElementById('home').scrollIntoView();
  }
  return <header className="site-header">
    <div className="mode-switch" aria-label="Choose your menu">
      <button className={`pill ${mode === 'pizza' ? 'selected' : ''}`} aria-pressed={mode === 'pizza'} onClick={() => changeMode('pizza')}>Home Pizza</button>
      <button className={`pill ${mode === 'burger' ? 'selected' : ''}`} aria-pressed={mode === 'burger'} onClick={() => changeMode('burger')}>Home Burger</button>
    </div>
    <a href="#home" className="brand" aria-label="Slice Town home" onClick={() => setMenuOpen(false)}><img src={asset('logo.svg')} alt="Slice Town" width="100" height="100" /></a>
    <button className="mobile-menu pill" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="site-nav" onClick={() => setMenuOpen(value => !value)}><span aria-hidden="true">{menuOpen ? '×' : '☰'}</span></button>
    <nav id="site-nav" className={`site-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
      {[['about-us', 'About us'], ['menu', 'Menu'], ['reservation', 'Reservation']].map(([id, label]) => <a key={id} href={`#${id}`} className={`pill ${active === id ? 'selected' : ''}`} onClick={() => setMenuOpen(false)}>{label}</a>)}
    </nav>
  </header>;
}

function Hero({ mode }) {
  const pizza = mode === 'pizza';
  const hero = useRef(null);
  useHeroMotion(hero, mode);
  return <section id="home" data-nav-section className={`hero ${pizza ? '' : 'burger-hero'}`} ref={hero}><div className="hero-stage">
    <h1 className="hero-copy"><span>Bite it. Love it. Repeat without any pause.</span><span>{pizza ? 'Hot slices. Big bites. No regrets forever more.' : 'Big burgers. Big bites. No regrets forever more.'}</span></h1>
    {pizza ? <div className="hero-art"><div className="hero-entrance" key={mode}><img className="whole-pizza" src={asset('hero-pizza.webp')} alt="A freshly baked pizza with pepperoni, olives and peppers" fetchPriority="high" width="1920" height="729" /><img className="pizza-hand" src={asset('hero-hand.webp')} alt="A hand reaching in for a slice" width="1920" height="729" /></div></div>
      : <img className="hero-burger" src={asset('burger.webp')} alt="A freshly grilled cheeseburger with tomato and lettuce" width="1000" height="1000" />}
    <img className="ingredient hero-pepper" src={asset('ingredient-pepper.webp')} alt="" width="395" height="434" />
    <img className="ingredient hero-leaf" src={asset('ingredient-leaf.webp')} alt="" width="440" height="388" />
  </div></section>;
}

function Story({ mode, onOrder }) {
  return <section id="about-us" data-nav-section className="story checker orange-check">
    <img className="ingredient story-mushroom" src={asset('ingredient-mushroom.webp')} alt="" loading="lazy" />
    <img className="ingredient story-chilli" src={asset('ingredient-chilli.webp')} alt="" loading="lazy" />
    <div className="story-copy">
      <h2>Where Every Perfect<br />{mode === 'pizza' ? 'Slice' : 'Bite'} Tells a Story</h2>
      <p>{mode === 'pizza' ? 'Our ingredients are fresh, our ovens are hot, and our team is fired up to serve you the best pies in town. From classic Margheritas to loaded flavor bombs, every pizza is made with intention, fun, and a little pizza magic. We believe pizza is more than food, it’s a celebration.' : 'Fresh ingredients, toasted buns, and big flavours. From our Town Classic to a spicy paneer favourite, every burger is made for good food and great company. Pull up a chair, bring your appetite, and make yourself at home.'}</p>
      <button className="pill story-order" onClick={onOrder}>Order your favourites <Arrow /></button>
    </div>
    <div className="photo-collage" aria-label="A taste of life at Slice Town">
      <div className="collage-track">{[0, 1].map(copy => <div className="collage-set" key={copy} aria-hidden={copy === 1 ? true : undefined}>{galleryAlts.map((alt, index) => <figure key={alt}><img src={asset(`gallery-${index + 1}.webp`)} alt={copy === 0 ? alt : ''} loading="lazy" width="360" height="400" /></figure>)}</div>)}</div>
    </div>
  </section>;
}

function MenuGroup({ group, onAdd }) {
  const twoSizes = group.items.some(item => item.length === 4);
  return <section className="menu-group" aria-label={group.title}>
    <div className="menu-group-heading"><h3>{group.kind && <span className={`food-dot ${group.kind}`} aria-hidden="true" />}{group.title}</h3><div className="price-labels">{twoSizes ? <><span>Regular</span><span>Large</span></> : <span>Price</span>}</div></div>
    {group.items.map(([name, description, regular, large]) => <div className="menu-item" key={name}>
      <div className="menu-item-copy"><h4>{name}</h4><p>{description}</p></div>
      <div className="menu-prices"><button aria-label={`Add ${name}${large ? ', regular' : ''} for ${money(regular)}`} onClick={() => onAdd({ name, price: regular, size: large ? 'Regular' : 'One portion' })}>{money(regular)}</button>{large !== undefined && <button aria-label={`Add ${name}, large for ${money(large)}`} onClick={() => onAdd({ name, price: large, size: 'Large' })}>{money(large)}</button>}</div>
    </div>)}
  </section>;
}

function FullMenu({ mode, onAdd }) {
  const groups = mode === 'pizza' ? pizzaGroups : burgerGroups;
  return <section id="menu" data-nav-section className="full-menu checker white-check">
    <img className="ingredient menu-basil" src={asset('ingredient-basil.webp')} alt="" loading="lazy" />
    <img className="ingredient menu-olive" src={asset('ingredient-olive.webp')} alt="" loading="lazy" />
    <div className="section-inner"><h2>{mode === 'pizza' ? 'Pizza' : 'Burger'} Lovers Choice</h2>
      <div className="menu-columns"><div><MenuGroup group={groups[0]} onAdd={onAdd} /><MenuGroup group={groups[2]} onAdd={onAdd} /></div><div><MenuGroup group={groups[1]} onAdd={onAdd} /><MenuGroup group={groups[3]} onAdd={onAdd} /></div></div>
      <p className="menu-hint">Pick a price to add a favourite to your order preview.</p>
    </div>
  </section>;
}

function TopPick({ item, onAdd }) {
  const [size, setSize] = useState(0);
  return <article className="top-pick">
    <div className="pick-image"><img src={asset(item.image)} alt={item.name} loading="lazy" width="550" height="550" />{item.hot && <span className="hot-stamp">Hot</span>}<button className="pill pick-order" onClick={() => onAdd({ name: item.name, price: item.prices[size], size: size === 0 ? 'Regular' : 'Large' })}>Order now <span aria-hidden="true">+</span></button></div>
    <h3>{item.name}</h3><div className="size-choices" aria-label={`${item.name} size`}>{item.prices.map((price, index) => <button key={index} aria-pressed={size === index} onClick={() => setSize(index)}><span>{index === 0 ? 'R' : 'L'}</span> - {money(price)}</button>)}</div>
  </article>;
}

function TopPicks({ mode, onAdd }) {
  const picks = mode === 'pizza' ? pizzaPicks : burgerPicks;
  return <section className="top-picks checker brown-check" id="top-picks"><div className="section-inner">
    <h2>Delicious Top Picks<br />{mode === 'pizza' ? 'From Our Oven' : 'From Our Grill'}</h2>
    <div className="picks-grid">{picks.map(item => <TopPick key={item.name} item={item} onAdd={onAdd} />)}</div>
    <Deals />
  </div></section>;
}

function Deals() {
  const rail = useRef(null);
  const scroll = direction => rail.current.scrollBy({ left: direction * (rail.current.clientWidth / (innerWidth > 700 ? 2 : 1)), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  return <div className="deals"><div className="section-heading"><h2>Hot Deals</h2><div className="deal-arrows"><button className="icon-button" aria-label="Previous deal" onClick={() => scroll(-1)}><Arrow direction="left" /></button><button className="icon-button" aria-label="Next deal" onClick={() => scroll(1)}><Arrow /></button></div></div><div className="deals-rail" ref={rail}>{['A little more pizza for your weekend', 'Fresh pizza, great deals', 'Share a slice with your favourite people'].map((alt, index) => <img key={alt} src={asset(`offer-${index + 1}.webp`)} alt={alt} width="680" height="415" loading="lazy" />)}</div></div>;
}

function localDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function Reservation() {
  const form = useRef(null);
  const [confirmation, setConfirmation] = useState(null);
  const [error, setError] = useState('');
  function reserve(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    if (values.name.trim().length < 2) { setError('Please enter your full name.'); form.current.elements.name.focus(); return; }
    if (!/^[+()0-9 .-]{7,20}$/.test(values.phone)) { setError('Please enter a valid phone number, including an area code.'); form.current.elements.phone.focus(); return; }
    if (new Date(`${values.date}T${values.time}`) <= new Date()) { setError('Please choose a future date and time.'); form.current.elements.date.focus(); return; }
    setError('');
    setConfirmation(values);
  }
  return <section id="reservation" data-nav-section className="reservation">
    <div className="reservation-collage" aria-hidden="true">{[7, 2, 5, 6, 3, 11].map((number, index) => <img key={index} src={asset(`reservation-${number}.webp`)} alt="" loading="lazy" />)}</div>
    <div className="reservation-content"><h2>Reserve a Table</h2>
      <form className="reservation-form" ref={form} onSubmit={reserve}>
        {confirmation ? <div className="reservation-success" role="status"><span className="success-mark" aria-hidden="true">✓</span><h3>A little taste of what’s next.</h3><p>Table request preview for <strong>{confirmation.name}</strong>: {confirmation.guests} {Number(confirmation.guests) === 1 ? 'guest' : 'guests'} on {new Date(`${confirmation.date}T12:00:00`).toLocaleDateString('en-US', { dateStyle: 'long' })} at {confirmation.time}.</p><p className="demo-note">This is a local demo. No reservation has been sent or confirmed, and no message has been sent.</p><button type="button" className="pill selected" onClick={() => { setConfirmation(null); requestAnimationFrame(() => form.current.elements.name?.focus()); }}>Make another preview</button></div>
          : <><div className="form-grid">
            <label>Full Name*<input name="name" autoComplete="name" placeholder="John Smith" required minLength="2" maxLength="70" /></label>
            <label>Phone number*<input name="phone" type="tel" autoComplete="tel" placeholder="(310) 555-1234" title="Enter 7 to 20 phone-number characters" required /></label>
            <label>Email address*<input name="email" type="email" autoComplete="email" placeholder="john.smith@email.com" required /></label>
            <label>Number of guests*<select name="guests" defaultValue="4">{Array.from({ length: 12 }, (_, index) => <option key={index} value={index + 1}>{index + 1} {index === 0 ? 'guest' : 'guests'}</option>)}</select></label>
            <label>Date*<input name="date" type="date" required min={localDate()} /></label>
            <label>Time*<input name="time" type="time" required min="11:00" max="22:30" /></label>
            <label className="full-field">Special requests<textarea name="requests" rows="3" maxLength="500" placeholder="Anything we should know?" /></label>
          </div>{error && <p className="form-error" role="alert">{error}</p>}<button className="pill selected reserve-button" type="submit">Reserve Now <Arrow /></button><p className="demo-note">Reservation preview only. This demo does not send your details or book a table.</p></>}
      </form>
    </div>
  </section>;
}

function Testimonials() {
  return <section className="testimonials"><h2>Truly Loved by<br />People Like You</h2><div className="testimonial-board">
    <blockquote className="note yellow"><p>I’m not usually a dessert person, but that Nutella pizza changed my life. Unreal!</p><cite>Sneha T., New York</cite></blockquote>
    <blockquote className="note green"><p>Fast delivery, super fresh, and piping hot! Their combo meal is a weekend ritual for me.</p><cite>Billy Vasquez, California</cite></blockquote>
    <figure className="polaroid main-polaroid"><img src={asset('testimonial-1.webp')} alt="Friends enjoying pizza together" loading="lazy" width="390" height="390" /></figure>
    <blockquote className="note pink"><img className="note-tape" src={asset('tape-1.webp')} alt="" /><p>The best crust in town — crispy on the outside, soft inside. I dream about their Paneer Tandoori pizza!</p><cite>Mark, Vermont</cite></blockquote>
    <blockquote className="note blue"><img className="note-pin" src={asset('pin.webp')} alt="" /><p>Tried the BBQ Chicken Blaze and now I can’t go back to regular pizza. It’s dangerously good.</p><cite>Amanda Reed, Tokyo</cite></blockquote>
    <figure className="polaroid side-polaroid"><img src={asset('testimonial-2.webp')} alt="Sharing pizza around an outdoor table" loading="lazy" width="274" height="291" /></figure>
  </div></section>;
}

function Locations({ onOrder }) {
  return <><div className="offer-marquee" aria-label="Pizza offers"><div>{[0, 1].map(copy => <span key={copy}>Free Garlic Bread with Large Pizza! <span aria-hidden="true">✦</span> Buy 1 Get 1 Free Every Wednesday! <span aria-hidden="true">✦</span> Flat 20% Off on First Online Order! <span aria-hidden="true">✦</span> Weekend Combo – 2 Large Pizzas @ $25! <span aria-hidden="true">✦</span> </span>)}</div></div>
    <section className="locations section-inner" id="location"><div className="location-photo"><img src={asset('location.webp')} alt="The Slice Town neighbourhood restaurant" loading="lazy" width="700" height="670" /></div><div className="location-copy"><h2>Where To Find Us</h2>
      <address><h3>Downtown’s Pizza Spot</h3><p>7428 Sunset Blvd, Los Angeles, CA 90028</p><a href="tel:+12135551299">(213) 555-1299</a><p>Mon – Sun: 11:00 AM – 10:30 PM</p><a className="text-link" href="https://www.google.com/maps/search/?api=1&query=7428+Sunset+Blvd+Los+Angeles" target="_blank" rel="noreferrer">View on Map <Arrow /><span className="sr-only"> (opens in a new tab)</span></a></address>
      <address><h3>Beachside Buns & Bites</h3><p>1501 Ocean Front Walk, Venice, CA 90291</p><a href="tel:+13105557890">(310) 555-7890</a><p>Mon – Sun: 12:00 PM – 11:00 PM</p><a className="text-link" href="https://www.google.com/maps/search/?api=1&query=1501+Ocean+Front+Walk+Venice" target="_blank" rel="noreferrer">View on Map <Arrow /><span className="sr-only"> (opens in a new tab)</span></a></address>
    </div></section><section className="order-callout"><h2>Order Your Fresh Pizza Now</h2><p>Craving pizza? Build your favourites for pickup or delivery.</p><button className="pill selected" onClick={onOrder}>Order Now <Arrow /></button></section>
    <div className="social-gallery"><h3>Follow the fun @Slicetown</h3><div>{[1, 4, 2, 5].map((number, index) => <img key={index} src={asset(`gallery-${number}.webp`)} alt={galleryAlts[number - 1]} loading="lazy" />)}</div></div>
  </>;
}

function Footer({ onOrder }) {
  return <footer className="footer checker white-check"><button className="footer-marquee" onClick={onOrder} aria-label="Order from Slice Town — build a preview"><span className="footer-marquee-track">{[0, 1].map(copy => <span className="footer-marquee-set" key={copy} aria-hidden={copy === 1 ? true : undefined}>{[0, 1, 2].map(index => <span key={index}>Order – <b>Slice Town</b></span>)}</span>)}</span></button>
    <a href="#home" className="footer-logo" aria-label="Back to Slice Town home"><img src={asset('logo.svg')} alt="Slice Town" width="150" height="150" /></a><h2>Ready to Grab a Slice of Happiness?</h2><div className="footer-actions"><a className="pill selected" href="#reservation">Reserve a Table</a><a className="pill" href="#menu">View Menu</a></div><div className="footer-bottom"><p>Slice Town · A restaurant website demo</p><a href="#home">Back to top ↑</a><p>Orders and reservations are local previews.</p></div>
  </footer>;
}

function OrderDrawer({ open, onClose, cart, onChange, onAdd, picks }) {
  const dialog = useRef(null);
  const [fulfilment, setFulfilment] = useState('Pickup');
  const [ready, setReady] = useState(false);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  useEffect(() => { if (open && !dialog.current.open) { setReady(false); dialog.current.showModal(); if (!matchMedia('(prefers-reduced-motion: reduce)').matches) dialog.current.animate([{ transform: 'translateX(100%)' }, { transform: 'translateX(0)' }], { duration: 500, easing: 'cubic-bezier(.22,1,.36,1)' }); } else if (!open && dialog.current.open) dialog.current.close(); }, [open]);
  function change(item, delta) { setReady(false); onChange(item, delta); }
  return <dialog ref={dialog} className="order-drawer" onCancel={onClose} onClose={onClose} onClick={event => { if (event.target === event.currentTarget) onClose(); }}><div className="drawer-content"><header className="drawer-header"><div><p>Hot slices. Big bites.</p><h2>Your order</h2></div><button className="icon-button" aria-label="Close order" onClick={onClose}>×</button></header>
    <div className="fulfilment" aria-label="Order type">{['Pickup', 'Delivery'].map(type => <button key={type} aria-pressed={fulfilment === type} onClick={() => { setFulfilment(type); setReady(false); }}>{type}</button>)}</div>
    <p className="drawer-note">Build a {fulfilment.toLowerCase()} preview. No payment or real order will be placed.</p>
    {cart.length ? <ul className="cart-items">{cart.map(item => <li key={item.key}><div><h3>{item.name}</h3><p>{item.size} · {money(item.price)}</p></div><div className="quantity"><button aria-label={`Remove one ${item.name}, ${item.size}`} onClick={() => change(item, -1)}>−</button><span aria-label={`Quantity ${item.quantity}`}>{item.quantity}</span><button aria-label={`Add one ${item.name}, ${item.size}`} onClick={() => change(item, 1)}>+</button></div><strong>{money(item.price * item.quantity)}</strong></li>)}</ul> : <div className="empty-cart"><h3>A little hungry?</h3><p>Your order is empty. Start with a town favourite.</p></div>}
    <div className="quick-add"><h3>Something delicious</h3>{picks.map(item => <button key={item.name} onClick={() => { setReady(false); onAdd({ name: item.name, size: 'Regular', price: item.prices[0] }); }}><img src={asset(item.image)} alt="" width="56" height="56" /><span>{item.name}<small>{money(item.prices[0])}</small></span><b aria-hidden="true">+</b><span className="sr-only">Add to order</span></button>)}</div>
    <div className="cart-total"><span>Total</span><strong>{money(total)}</strong></div>
    {ready ? <div role="status" className="order-success"><h3>Your order preview is ready.</h3><p>{fulfilment} · {cart.reduce((sum, item) => sum + item.quantity, 0)} items · {money(total)}</p><p>This demo has not sent an order or taken payment.</p></div> : <button className="pill selected checkout-button" disabled={!cart.length} onClick={() => setReady(true)}>Preview order <Arrow /></button>}
  </div></dialog>;
}

export default function App() {
  const [mode, setMode] = useState('pizza');
  useReferenceMotion(mode);
  const [cart, setCart] = useState([]);
  const [orderOpen, setOrderOpen] = useState(false);
  function add(item, reveal = true) {
    const key = `${item.name}-${item.size}`;
    setCart(current => current.some(entry => entry.key === key) ? current.map(entry => entry.key === key ? { ...entry, quantity: entry.quantity + 1 } : entry) : [...current, { ...item, key, quantity: 1 }]);
    if (reveal) setOrderOpen(true);
  }
  function change(item, delta) {
    setCart(current => current.map(entry => entry.key === item.key ? { ...entry, quantity: entry.quantity + delta } : entry).filter(entry => entry.quantity > 0));
  }
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  return <><a className="skip-link" href="#menu">Skip to menu</a><Header mode={mode} onMode={setMode} /><main><Hero mode={mode} /><Story mode={mode} onOrder={() => setOrderOpen(true)} /><FullMenu mode={mode} onAdd={add} /><TopPicks mode={mode} onAdd={add} /><Reservation /><Testimonials /><Locations onOrder={() => setOrderOpen(true)} /></main><Footer onOrder={() => setOrderOpen(true)} /><button className="pill floating-order" onClick={() => setOrderOpen(true)} aria-haspopup="dialog">Order Now <span className="order-count" key={count} aria-label={count ? `${count} items in order` : undefined}>{count || '+'}</span></button><OrderDrawer open={orderOpen} onClose={() => setOrderOpen(false)} cart={cart} onChange={change} onAdd={item => add(item, false)} picks={mode === 'pizza' ? pizzaPicks : burgerPicks} /></>;
}
