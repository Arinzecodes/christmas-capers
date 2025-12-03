const dataURL = "./data.json";
const swipers = [
  ...document.querySelectorAll(".product-swiper > .swiper-wrapper"),
];
const checkoutBtn = document.querySelector(".checkout-btn");
const inShop = window.location.pathname === "/shop.html";
const cart = JSON.parse(localStorage.getItem("CART")) ?? {};

function toggleCheckoutBtn() {
  if (!inShop) return;
  if (Object.values(cart).length <= 0) {
    checkoutBtn.style.display = "none";
  } else {
    checkoutBtn.style.display = "initial";
  }
}

function loadOptions(data) {
  Object.keys(data).forEach((category) => {
    const swiper = swipers.find(
      (s) => s.dataset.category === category.toLowerCase()
    );
    if (swiper == null) return;
    data[category].forEach((obj) => {
      //* Data Variables
      const {
        name,
        price,
        // ? If there is maximum quantity in stock
        max,
        // ? An object of sizes available and the multipliers for each
        // ? It does not need to be specified in the JSON. There are defaults
        //  Ex:
        //  {
        // "XS": 0.3,
        // "M": 1.1,
        //  "XXL": 2.5
        // }
        sizes,
        colors,
        fund,
        image: { desktop: desktopImageSRC },
      } = obj;

      const {
        quantity: previousQuantity,
        size: previousSize,
        color: previousColor,
      } = cart[name] ?? {
        quantity: 1,
        size: "M",
        color: "",
      };

      let quantity = previousQuantity;
      let size = previousSize;
      let color = previousColor;
      let isAdded = added();
      let sizeOptions = sizes ?? { M: 1 };
      let colorOptions = colors ?? [];
      const hasMultiSizeOptions = Object.keys(sizeOptions).length > 1;
      const hasColorOptions = colorOptions.length > 0;

      //* Creation of the new Elements (also adding some of their attributes and content)
      const swiperWrapper = newElementWithClass("div", "swiper-slide");
      const element = newElementWithClass(
        "div",
        "product-card",
        "position-relative"
      );
      const imageHolder = newElementWithClass("div", "image-holder");

      const image = newElementWithClass(
        "img",
        "img-fluid",
        "rounded",
        isAdded ? "added" : "not-added"
      );
      image.src = desktopImageSRC;
      image.alt = "product-item";

      const cartConcern = newElementWithClass(
        "div",
        "cart-concern",
        "position-absolute"
      );

      const addButton = newElementWithClass(
        "a",
        "btn",
        "btn-medium",
        !isAdded ? "btn-light" : "btn-dark"
      );
      addButton.textContent = isAdded ? "Added" : "Add To Cart";
      const cartIcon = newElementWithClass("svg", "cart-outline");
      cartIcon.innerHTML = `<use xlink:href="#cart-outline"></use>`;
      const addButtonWrapper = addElementsTo(
        newElementWithClass("div", "cart-button", "d-flex"),
        addElementsTo(addButton, cartIcon)
      );

      const quantityButton = newElementWithClass(
        "div",
        "btn",
        "btn-medium",
        "btn-primary",
        "d-flex",
        "gap-2"
      );
      const quantityText = addElementsTo(newElementWithClass("span"), quantity);
      const incrementButton = addElementsTo(
        newElementWithClass("button", "quantity-btn"),
        addElementsTo(newElement("span"), "+")
      );
      const decrementButton = addElementsTo(
        newElementWithClass("button", "quantity-btn"),
        addElementsTo(newElement("span"), "-")
      );
      const quantityButtonWrapper = addElementsTo(
        newElementWithClass("div", "cart-button", "d-flex"),
        addElementsTo(
          quantityButton,
          decrementButton,
          quantityText,
          incrementButton
        )
      );

      const cartDetails = newElementWithClass(
        "div",
        "card-detail",
        "d-flex",
        "flex-column",
        "justify-content-between",
        "align-items-baseline",
        "pt-3"
      );
      const title = newElementWithClass(
        "h6",
        "card-title",
        "text-uppercase",
        "text-nowrap"
      );

      const titleTextContent = newElement("a");
      titleTextContent.href = "#";
      titleTextContent.textContent = name;

      const priceTextContent = newElementWithClass(
        "span",
        "item-price",
        "text-primary",
        "h6"
      );
      const fundTextContent = newElementWithClass(
        "p",
        "item-fund",
        "text-secondary"
      );

      const extraFundText = addElementsTo(
        newElementWithClass("p", "text-primary", "item-fund"),
        "Hope Bag Charity Fund"
      );
      updatePriceText();

      const sizeOptionsItems = Object.keys(sizeOptions).map((sizeOption) => {
        const element = addElementsTo(
          newElementWithClass(
            "li",
            "size-option",
            sizeOption === size ? "selected" : "not-selected"
          ),
          sizeOption
        );

        element.addEventListener("click", () => {
          if (element.classList.contains("selected")) return;
          addClassTo(element, "selected");
          element.classList.remove("not-selected");
          sizeOptionsItems
            .filter((opt) => element != opt)
            .forEach((opt) => {
              addClassTo(opt, "not-selected");
              opt.classList.remove("selected");
            });
          size = sizeOption;
          updatePriceText();
          addToCart();
        });
        return element;
      });

      const sizeOptionContainer = addElementsTo(
        newElementWithClass(
          "ul",
          isAdded && inShop && hasMultiSizeOptions ? "d-flex" : "d-none",
          "flex-column",
          "gap-2",
          "position-absolute",
          "list-unstyled",
          "p-3"
        ),
        ...sizeOptionsItems
      );

      const colorOptionsItems = colorOptions.map((colorOption) => {
        const element = newElementWithClass(
          "li",
          "color-option",
          colorOption === color ? "selected" : "not-selected"
        );

        element.style.backgroundColor = colorOption;

        element.addEventListener("click", () => {
          if (element.classList.contains("selected")) return;
          addClassTo(element, "selected");
          element.classList.remove("not-selected");
          colorOptionsItems
            .filter((opt) => element != opt)
            .forEach((opt) => {
              addClassTo(opt, "not-selected");
              opt.classList.remove("selected");
            });
          color = colorOption;
          updateProductImage();
          addToCart();
        });

        return element;
      });

      const colorOptionContainer = addElementsTo(
        newElementWithClass(
          "ul",
          hasColorOptions ? "d-flex" : "d-none",
          "flex-column",
          "gap-2",
          "position-absolute",
          "list-unstyled",
          "p-3"
        ),
        ...colorOptionsItems
      );

      //* Functions

      function updateCart() {
        localStorage.setItem("CART", JSON.stringify(cart));
        toggleCheckoutBtn();
      }

      function added() {
        return cart[name] != null;
      }

      function updateProductImage() {
        image.src = `${desktopImageSRC.slice(
          0,
          desktopImageSRC.length - 4
        )}-${color}.jpg`;
      }

      function updatePriceText() {
        priceTextContent.textContent = `${nairaFormat(
          price * (sizeOptions[size] ?? 1)
        )}`;
        fundTextContent.textContent = `${nairaFormat(
          fund * (sizeOptions[size] ?? 1)
        )} out of the price will be donated to the `;
        addElementsTo(fundTextContent, extraFundText);
      }

      function addToCart() {
        const obj = {
          name: name,
          price: price,
          quantity: quantity,
          total: price * quantity,
          imageSRC:
            color != ""
              ? `${desktopImageSRC.slice(
                  0,
                  desktopImageSRC.length - 4
                )}-${color}.jpg`
              : desktopImageSRC,
          size: size,
          color: color,
          sizes: sizes ?? { M: 1 },
        };
        isAdded = true;

        cart[name] = obj;
        updateCart();
      }

      function removeFromCart() {
        isAdded = false;
        quantity = 1;
        delete cart[name];
        updateCart();
      }

      function updateQuantity() {
        quantityText.textContent = quantity;
        addToCart();
      }

      function removeCartSelection() {
        removeFromCart();
        addButton.classList.remove("btn-dark");
        addClassTo(addButton, "btn-light");
        addButton.textContent = "Add to Cart";
        addClassTo(image, "not-added");
        image.classList.remove("added");
        addClassTo(sizeOptionContainer, "d-none");
      }

      //* Event Listeners
      addButtonWrapper.addEventListener("click", () => {
        if (!isAdded) {
          addToCart();
          addButton.classList.remove("btn-light");
          addClassTo(addButton, "btn-dark");
          addButton.textContent = "Added";
          addClassTo(image, "added");
          image.classList.remove("not-added");

          if (!inShop) return;
          cartConcern.removeChild(addButtonWrapper);
          addElementsTo(cartConcern, quantityButtonWrapper);

          if (!hasMultiSizeOptions) return;
          sizeOptionContainer.classList.remove("d-none");
        } else {
          removeCartSelection();
        }
      });

      incrementButton.addEventListener("click", () => {
        if (max != null && quantity >= max) return;
        quantity++;
        updateQuantity();
      });

      decrementButton.addEventListener("click", () => {
        if (quantity <= 1) {
          removeCartSelection();
          cartConcern.removeChild(quantityButtonWrapper);
          addElementsTo(cartConcern, addButtonWrapper);
          return;
        }
        quantity--;
        updateQuantity();
      });

      image.addEventListener("click", () => {
        removeCartSelection();
        cartConcern.removeChild(quantityButtonWrapper);
        addElementsTo(cartConcern, addButtonWrapper);
      });

      //* Adding all the markup to the DOM
      addElementsTo(
        swiperWrapper,
        addElementsTo(
          element,
          addElementsTo(
            imageHolder,
            sizeOptionContainer,
            colorOptionContainer,
            image
          ),
          addElementsTo(
            cartConcern,
            inShop && isAdded ? quantityButtonWrapper : addButtonWrapper
          ),
          addElementsTo(
            cartDetails,
            addElementsTo(title, titleTextContent),
            priceTextContent,
            fund != null ? fundTextContent : ""
          )
        )
      );

      if (color != "") updateProductImage();

      addElementsTo(swiper, swiperWrapper);
    });
  });
}

toggleCheckoutBtn();
document.addEventListener("DOMContentLoaded", fetchData(dataURL, loadOptions));
