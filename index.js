import express from "express";
import mongoose from "mongoose";
import path from "path";  // استخدام path من Node.js
import { fileURLToPath } from "url";  // لاستخراج المسار
import Article from "./models/Article.js"


const __filename = fileURLToPath(import.meta.url);  // تحويل URL إلى مسار الملف
const __dirname = path.dirname(__filename);  // الحصول على المسار الخاص بالمجلد

const app = express();

app.use(express.static(path.join(__dirname, "public")));  // مسار المجلد public والذي يحتوى على كل الملفات ال static أي الثابتة للمشروع مثل ملفات الصور والخطوط والتنسيقات وخلافه
// تحديد مسار المجلد أي القالب وهو هنا مجلد views الذي يحوي الملفات الديناميكية 
app.set("views", path.join(__dirname, "views")); 
app.set("view engine", "ejs"); //  تحديد المحرك الذي سيتعامل مع الملفات الديناميكية وتحديد نوع هذه الملفات وهو هنا ملف ejs

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(
    "mongodb+srv://aliobaid:home242475@cluster0.qweaw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  );
  console.log("done");
}

// mongodb+srv://aliobaid:<db_password>@cluster0.qweaw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

app.use(express.json());

app.get("/numbers", (req, res) => {
  let numbers = "";
  for (let i = 0; i <= 100; i++) {
    numbers += i + " - ";
  }
  res.render("numbers.ejs", { list: numbers, name: "ali" });
});
app.get("/hi", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "hi.html"));
  // res.send(__dirname + "/views/numbers.html" );
});
app.post("/test", (req, res) => {
  res.send("you are welcome from test page");
});

app.get("/sum/:num1/:num2", (req, res) => {
  const number1 = req.params.num1;
  const number2 = req.params.num2;
  res.send(`the sum is: ${Number(number1) + Number(number2)}`);
});

app.get("/sum2", (req, res) => {
  const number1 = req.body.num1;
  const number2 = req.body.num2;
  const sum = Number(number1) + Number(number2);
  res.send(`the sum is: ${sum}`);
});

app.get("/sum3", (req, res) => {
  const number1 = req.query.num1;
  const number2 = req.query.num2;
  const sum = Number(number1) + Number(number2);
  res.json({ sum: sum, num1: number1, num2: number2 });
});

app.listen(3001, () => {
  console.log("port is 3001");
});

// Article Requests
app.post("/articles", async(req, res)=>{
  const newArticle = new Article()
  const articleT = req.body.articleTitle
  const articleB = req.body.articleBody
  newArticle.title = articleT
  newArticle.body = articleB
  newArticle.numberOfLikes = 100
  await newArticle.save()
  res.json(newArticle)
})

app.get("/articles", async (req, res)=>{
  const articles = await Article.find()
  res.send(articles)
})
app.get("/articles/:articleId", async (req, res)=>{
  const id = req.params.articleId
  const article = await Article.findById(id)
  res.send(article)
})
app.delete("/articles/:articleId", async(req, res)=>{
  const id = req.params.articleId
  await Article.findByIdAndDelete(id)
  res.send("article is deleted")
})
app.get("/showArticles", async (req, res)=>{
  const articles = await Article.find()
  res.render("articles.ejs", {allArticles: articles})
})