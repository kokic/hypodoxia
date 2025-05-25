// log-message.ts
var hypodoxiaMessage = (msg) => `[Hypodoxia] ${msg}`;
var responseErrorMessage = (response) => hypodoxiaMessage(`Response error: ${JSON.stringify(response)}`);
var fetchErrorMessage = (url) => hypodoxiaMessage(`Error fetching or parsing \`${url}\`. \n`);

// subscribed-type.ts
class SubscribedType {
  value;
  static STATIC = new SubscribedType("static");
  static QUERY = new SubscribedType("query");
  constructor(value) {
    this.value = value;
  }
  getUrl(link, host) {
    return this.value === SubscribedType.STATIC.value ? link : this.value === SubscribedType.QUERY.value ? `${link}?host=${host}` : link;
  }
}
var subscribed_type_default = SubscribedType;

// fetch-comments.ts
async function fetchHypodoxia(link, href = link, matcher = matchHypodoxiaJson, subscribed = subscribed_type_default.STATIC) {
  const url = subscribed.getUrl(link, href);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(responseErrorMessage(response));
    }
    return matcher(await response.text(), href);
  } catch (error) {
    console.error(fetchErrorMessage(url), error);
    return [];
  }
}
function matchHypodoxiaJson(json, href) {
  const comments = JSON.parse(json);
  return comments.filter((comment) => comment.href === href).map((comment) => comment.text);
}

// hypodoxia.ts
class Hypodoxia {
  list;
  loaded = false;
  comments = [];
  constructor(list) {
    this.list = list;
  }
  async loadCommentsOnce(matcher = matchHypodoxiaJson, href = document.location.href) {
    if (this.loaded === true) {
      return this.comments;
    }
    for (const { name, link, type } of this.list) {
      const associated = (await fetchHypodoxia(link, href, matcher, type)).map((text) => ({ name, text }));
      this.comments.push(...associated);
    }
    this.loaded = true;
    return this.comments;
  }
  async defaultView(titleText = View.defaultTitleText) {
    return await View.toElement(this, titleText);
  }
  async appendTo(div) {
    document.addEventListener("DOMContentLoaded", async () => div.appendChild(await this.defaultView()));
  }
  async appendToIfNotEmpty(div) {
    const comments = await this.loadCommentsOnce();
    if (comments.length > 0) {
      await this.appendTo(div);
    }
  }
}
var View;
((View) => {
  View.defaultTitleText = (n) => `${n} \u6761\u8BC4\u8BBA`;
  async function toElement(self, titleText = View.defaultTitleText) {
    const comments = await self.loadCommentsOnce();
    const container = document.createElement("div");
    Object.assign(container.style, Styles.container);
    const title = document.createElement("h2");
    title.textContent = titleText(comments.length);
    Object.assign(title.style, Styles.title);
    container.appendChild(title);
    comments.forEach((comment) => {
      const commentDiv = document.createElement("div");
      Object.assign(commentDiv.style, Styles.comment);
      const nameElement = document.createElement("div");
      nameElement.textContent = comment.name;
      Object.assign(nameElement.style, Styles.name);
      const textElement = document.createElement("p");
      textElement.textContent = comment.text;
      Object.assign(textElement.style, Styles.text);
      commentDiv.appendChild(nameElement);
      commentDiv.appendChild(textElement);
      container.appendChild(commentDiv);
    });
    return container;
  }
  View.toElement = toElement;
})(View ||= {});
var Styles;
((Styles) => {
  Styles.container = {
    margin: "0 auto",
    padding: "20px"
  };
  Styles.title = {
    fontSize: "20px",
    margin: "0 0 1em 0"
  };
  Styles.comment = {
    padding: "0.5em 1em",
    marginTop: "0.5em",
    marginBottom: "0.5em"
  };
  Styles.name = {
    fontWeight: "bold",
    marginBottom: "8px"
  };
  Styles.text = {
    lineHeight: "1.5"
  };
})(Styles ||= {});
var hypodoxia_default = Hypodoxia;
export {
  hypodoxia_default as default,
  View
};
