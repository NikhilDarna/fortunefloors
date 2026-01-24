import Quill from "quill";

const BlockEmbed = Quill.import("blots/block/embed");

class BlogImageBlot extends BlockEmbed {
  static blotName = "blogImage";
  static tagName = "div";
  static className = "blog-image-block";

  static create(value) {
    const node = super.create();

    node.setAttribute("data-layout", value.layout || "image-left");

    const img = document.createElement("img");
    img.src = value.src;

    const text = document.createElement("div");
    text.className = "blog-text";
    text.innerHTML = value.text || "<p>Write text here...</p>";

    node.appendChild(img);
    node.appendChild(text);

    return node;
  }

  static value(node) {
    return {
      src: node.querySelector("img")?.src,
      layout: node.getAttribute("data-layout"),
      text: node.querySelector(".blog-text")?.innerHTML,
    };
  }
}

Quill.register(BlogImageBlot);
export default BlogImageBlot;
