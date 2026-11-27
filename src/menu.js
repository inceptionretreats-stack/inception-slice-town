export const pizzaGroups = [
  { title: 'Veg Pizzas', kind: 'veg', items: [
    ['Margherita Magic', 'A classic with tomato sauce, mozzarella, and golden thin crust.', 7.99, 10.99],
    ['Farmhouse Crunch', 'Mushrooms, bell peppers, olives, and onions on a cheesy crust.', 8.99, 11.99],
    ['Paneer Tandoori Twist', 'Spiced paneer with onions, capsicum, and tikka sauce on a thin crust.', 7.49, 9.49],
    ['Cheesy Corn Carnival', 'Mushrooms, sweet corn, jalapeños, olives, and melted cheese.', 6.99, 9.49],
    ['Spicy Veggie Volcano', 'A fiery mix of peppers, onions, jalapeños, and molten cheese.', 4.99, 6.99],
    ['Italian Garden Delight', 'Tomatoes, zucchini, olives, and basil drizzled with olive oil.', 3.99, 7.99],
    ['Green Goodness', 'Spinach, broccoli, zucchini, and herbs on a wholesome thin crust.', 8.49, 10.49],
    ['Mexi-Corn Fiesta', 'Corn, capsicum, onions, jalapeños, and olives with salsa sauce.', 6.49, 8.49],
  ] },
  { title: 'Non-Veg Pizzas', kind: 'nonveg', items: [
    ['Pepperoni Powerhouse', 'Layers of pepperoni with mozzarella and marinara on the crust.', 10.99, 12.99],
    ['BBQ Chicken Melt', 'Grilled chicken with BBQ sauce, onions, and gooey mozzarella.', 6.49, 9.99],
    ['Tandoori Chicken Blaze', 'Chicken tikka with onions, capsicum, and smoky spices.', 9.49, 11.49],
    ['Meat Lovers Supreme', 'Pepperoni, sausage, chicken, and ham with melted cheese.', 7.49, 9.49],
    ['Peri Peri Chicken Punch', 'Chicken tossed in peri peri sauce with onions for flavor.', 3.99, 7.49],
    ['Spicy Chicken Keema Delight', 'Minced chicken keema with jalapeños, herbs, and melted cheese.', 6.49, 11.49],
  ] },
  { title: 'Add-ons', items: [
    ['Extra Cheese', 'Double the cheesy indulgence on your favorite pizza.', 1.99],
    ['Garlic Dip', 'Creamy garlic dip that’s smooth, rich, and flavorful.', 2.99],
    ['Chili Flakes & Oregano Pack', 'Zesty mix of chili flakes and oregano.', .99],
    ['Stuffed Crust Upgrade', 'Cheesy stuffed-crust baked to perfection.', 3.99],
  ] },
  { title: 'Desserts', items: [
    ['Choco Lava Slice', 'Decadent slice with molten chocolate lava at the center.', 4.99],
    ['Mini Nutella Pizza', 'Crispy mini pizza topped with smooth Nutella spread.', 2.99],
    ['Tiramisu Jar', 'Creamy tiramisu layers in a jar, dusted with cocoa powder.', 3.99],
    ['Classic Cheesecake', 'Smooth, creamy cheesecake topped with a hint of vanilla.', 5.99],
    ['Brownie Fudge Delight', 'Rich chocolate brownie layered with gooey fudge and nuts.', 4.49],
  ] },
];

export const burgerGroups = [
  { title: 'Veg Burgers', kind: 'veg', items: [
    ['Garden Crunch', 'A crisp vegetable patty, lettuce, tomato and our house sauce.', 7.99, 10.99],
    ['Paneer Tandoori Burger', 'Spiced paneer, pickled onions and a creamy tandoori sauce.', 8.49, 11.49],
    ['The Mushroom Melt', 'Roasted mushrooms, melted cheese and caramelised onions.', 8.99, 11.99],
    ['Chilli Cheese Stack', 'A crunchy patty, jalapeños and a generous layer of cheese.', 7.49, 10.49],
  ] },
  { title: 'Chicken & Beef Burgers', kind: 'nonveg', items: [
    ['The Town Classic', 'A grilled beef patty, cheese, lettuce, pickles and house sauce.', 10.99, 13.99],
    ['Smoky BBQ Chicken', 'Grilled chicken, smoky barbecue sauce and crisp onions.', 9.49, 12.49],
    ['Peri Peri Chicken', 'Spicy chicken with cooling slaw in a toasted bun.', 9.99, 12.99],
    ['Double Trouble', 'Two beef patties, double cheese, pickles and special sauce.', 12.99, 15.99],
  ] },
  { title: 'On the Side', items: [
    ['Golden Fries', 'Crispy, golden and lightly salted.', 3.99],
    ['Loaded Cheese Fries', 'Golden fries finished with melted cheese and herbs.', 5.49],
    ['Onion Rings', 'A little crunch with every bite.', 4.49],
    ['Garlic Dip', 'Creamy garlic dip that’s smooth, rich, and flavorful.', 2.99],
  ] },
  pizzaGroups[3],
];

export const pizzaPicks = [
  { name: 'Spicy peri peri paneer', image: 'pick-1.webp', prices: [8, 12] },
  { name: 'Farmhouse supreme', image: 'pick-2.webp', prices: [16, 20], hot: true },
  { name: 'Triple cheese overload', image: 'pick-3.webp', prices: [22, 28] },
  { name: 'BBQ chicken blaze', image: 'pick-4.webp', prices: [36, 44] },
];

export const burgerPicks = [
  { name: 'The Town classic', image: 'burger.webp', prices: [10.99, 13.99] },
  { name: 'Smoky BBQ chicken', image: 'burger.webp', prices: [9.49, 12.49], hot: true },
  { name: 'Paneer tandoori burger', image: 'burger.webp', prices: [8.49, 11.49] },
  { name: 'Double trouble', image: 'burger.webp', prices: [12.99, 15.99] },
];

export const money = amount => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: Number.isInteger(amount) ? 0 : 2 }).format(amount);
