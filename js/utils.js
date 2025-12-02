/**
 * Gets data from a URL and does somthing with it
 * @param {string} URL The Path of the endpoint
 * @param {() => void} func The operation to be done on the data
 */
async function fetchData(URL, func) {
  try {
    const response = await fetch(URL);
    if (!response.ok) throw new Error("Response was somehow not ok?");
    const data = await response.json();
    func(data);
  } catch (error) {
    console.error(":O An Error?!:", error);
  }
}

/**
 * A quick shortcut for the document.createElement method
 * @param {keyof HTMLElementTagNameMap} tagName the various tagnames
 * @returns {Element}
 */
function newElement(tagName) {
  return document.createElement(tagName);
}

/**
 * Adds some classes to an element
 * @param {Element} element The element the classes will be added to
 * @param  {...string} classNames The classes as string tokens
 */
function addClassTo(element, ...classNames) {
  element.classList.add(...classNames);
}

/**
 * Adds some children to an element and returns said element
 * @param {Element} parent The element the elements will be added to
 * @param  {...(Node | string)} children The elements which can also be strings
 * @returns {Element}
 */
function addElementsTo(parent, ...children) {
  parent.append(...children);
  return parent;
}

/**
 * A shorthand way of creating an element with certain classes in one method
 * @param {keyof HTMLElementTagNameMap} tagName the various tagnames
 * @param  {...string} classNames The classes as string tokens
 * @returns {Element}
 */
function newElementWithClass(tagName, ...classNames) {
  const element = newElement(tagName);
  if (classNames.length > 0) addClassTo(element, ...classNames);
  return element;
}

/**
 * Returns a copy of an element
 *
 * TODO: Have Fun :)
 *
 * ? Note: Children have all booleans as true
 * @param {Element} original the element to be copied
 * @param {boolean} withChildren will copy the children as well if there are any
 * @param {boolean} withText will copy the textContent of the original if there is some
 * @returns {Element}
 */
function copyElement(original, withChildren, withText) {
  const copy = newElementWithClass(
    original.tagName,
    ...original.classList.values()
  );
  if (withText && original.textContent) {
    copy.textContent = original.textContent;
  }
  if (withChildren && original.children.length > 0) {
    return addElementsTo(
      copy,
      ...Array.from(original.children).map((child) =>
        copyElement(child, true, true)
      )
    );
  }
  return copy;
}

/**
 * Formats a number to a Naira currency format such as ₦X,XXXX.XX
 * @param {Number} number - The number to be formatted
 * @returns {string}
 */
function nairaFormat(number) {
  return `${new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(number)}`;
}
