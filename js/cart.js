const cart = JSON.parse(localStorage.getItem("CART")) ?? {};
const cartItems = Object.values(cart);
const orderedItems = document.querySelector(".ordered-items");
const cartTotalElement = document.querySelector(".total");
const cartQuantityElement = document.querySelector(".cart-quantity");
const confirmBtn = document.querySelector(".cart-confirm-btn");

function cartTotal() {
  return cartItems.reduce(
    (total, { price, quantity, size, sizes: sizeMultipliers }) =>
      total + price * quantity * (sizeMultipliers[size] ?? 1),
    0
  );
}

function cartQuantity() {
  return cartItems.length;
}

cartTotalElement.textContent = `${nairaFormat(cartTotal())}`;
cartQuantityElement.textContent = cartQuantity();

if (cartItems.length <= 0) {
  confirmBtn.textContent = "Shop for Items";
  confirmBtn.href = "/shop.html";
  addElementsTo(
    orderedItems,
    addElementsTo(newElementWithClass("h3", "item"), "No Items Here")
  );
} else {
  cartItems.forEach((item) => {
    const { name, price, quantity, size, imageSRC, sizes } = item;

    const image = newElementWithClass("img", "img-fluid");
    image.src = imageSRC;
    image.alt = "cart image";

    addElementsTo(
      orderedItems,
      addElementsTo(
        // The list item
        newElementWithClass("li", "item", "row", "align-items-center"),
        addElementsTo(
          newElementWithClass("div", "image-holder", "cart-img"),
          image
        ),
        addElementsTo(
          newElementWithClass("span", "col", "w-100`"),
          // The title
          addElementsTo(
            newElementWithClass(
              "h6",
              "d-flex",
              "align-items-center",
              "text-nowrap",
              "gap-1",
              "col"
            ),

            addElementsTo(newElementWithClass("span", "text-primary"), name),

            addElementsTo(
              newElementWithClass("span"),
              Object.keys(sizes).length > 1 ? size : ""
            )
          ),
          addElementsTo(
            newElementWithClass("span", "d-flex", "gap-2", "col"),
            addElementsTo(newElement("span"), `${quantity}x`),
            addElementsTo(
              newElement("span"),
              `${nairaFormat(price * sizes[size])}`
            ),
            addElementsTo(
              newElement("span"),
              `${nairaFormat(quantity * price * sizes[size])}`
            )
          )
        )
      )
    );
  });
}
