/**
 * SPA 问答小游戏（纯前端静态站点）
 * - 关键状态：currentIndex / score
 * - 核心渲染：renderQuestion()
 */

// 题库：10 道基础四则运算题（难度适中）
const questions = [
  {
    question: "主播最喜欢的游戏是什么",
    options: ["赛马娘", "蔚蓝档案", "雀魂", "学园偶像大师"],
    correctAnswer: "学园偶像大师",
  },
  {
    question: "粉丝对主播的称呼是什么",
    options: ["区", "大沧哥", "主播", "沧老师"],
    correctAnswer: "沧老师",
  },
  {
    question: "主播今年抽了几次游戏周边",
    options: [1, 2, 3, 4],
    correctAnswer: 3,
  },
  {
    question: "主播喜欢的女角色类型是",
    options: ["温柔姐系大雷", "可爱小雷美少女", "肌肉大姐姐", "白丝贫乳幼女"],
    correctAnswer: "可爱小雷美少女",
  },
  {
    question: "为了冲刺十万粉，主播许下的承诺是每月几更，每少一更抽一次周边",
    options: [4, 6, 8, 12],
    correctAnswer: 8,
  },
  {
    question: "主播毕业后从事的第一份二游相关工作是",
    options: ["数值策划", "场景美术", "引擎开发", "市场运营"],
    correctAnswer: "数值策划",
  },
  {
    question: "主播为了维持粉丝经济，建立了几个可加入的讨论群",
    options: [0, 1, 2, 3],
    correctAnswer: 1,
  },
  {
    question: "主播最擅长的dota2英雄是",
    options: ["痛苦女王", "幽鬼", "刚背兽", "影魔"],
    correctAnswer: "刚背兽",
  },
  {
    question: "为了提纯粉丝，今年年终盘点时给哪些粉丝送了礼物",
    options: ["充电榜前十的粉丝", "年度up是当年沧海的粉丝", "获得up主新春祝福的粉丝", "参与当天直播间粉丝牌抽奖的粉丝"],
    correctAnswer: "年度up是当年沧海的粉丝",
  },
  {
    question: "主播视频中，哪种颜色字幕代表视频为商单视频",
    options: ["红色", "蓝色", "绿色", "黄色"],
    correctAnswer: "黄色",
  },
];

let currentIndex = 0;
let score = 0;
let isTransitioning = false;

const quizCard = document.getElementById("quizCard");
const resultCard = document.getElementById("resultCard");
const progressEl = document.getElementById("progress");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const finalScoreEl = document.getElementById("finalScore");
const meterFillEl = document.getElementById("meterFill");
const resultLevelEl = document.getElementById("resultLevel");
const resultCommentEl = document.getElementById("resultComment");
const restartBtn = document.getElementById("restartBtn");

function shuffle(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function setOptionsDisabled(disabled) {
  const buttons = optionsEl.querySelectorAll("button");
  buttons.forEach((b) => {
    b.disabled = disabled;
  });
}

function animateSwap(next) {
  if (isTransitioning) return;
  isTransitioning = true;
  setOptionsDisabled(true);

  quizCard.classList.remove("is-entering");
  quizCard.classList.add("is-leaving");

  window.setTimeout(() => {
    next();

    quizCard.classList.remove("is-leaving");
    quizCard.classList.add("is-entering");

    window.setTimeout(() => {
      quizCard.classList.remove("is-entering");
      isTransitioning = false;
      setOptionsDisabled(false);
    }, 20);
  }, 220);
}

/**
 * 渲染当前题目：清空旧 DOM 并注入新题目内容
 */
function renderQuestion() {
  if (currentIndex >= questions.length) {
    showResult();
    return;
  }

  const q = questions[currentIndex];

  progressEl.textContent = `题号：${currentIndex + 1}/${questions.length}`;
  questionEl.textContent = q.question;

  optionsEl.innerHTML = "";

  // 为了避免固定选项位置带来的“背答案”，每次渲染对选项做一次随机排序
  const options = shuffle(q.options);
  options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn";
    btn.textContent = String(opt);

    btn.addEventListener("click", () => {
      if (isTransitioning) return;

      if (opt === q.correctAnswer) {
        score += 1;
      }

      currentIndex += 1;
      animateSwap(renderQuestion);
    });

    optionsEl.appendChild(btn);
  });
}

function getLevelAndComment(finalScore, total) {
  const pct = total === 0 ? 0 : finalScore / total;

  if (finalScore === total) {
    return {
      level: "结晶本晶",
      comment:
        "你的答题轨迹像一条精准的霓虹光路：每个梗、每个细节、每个“只有常驻才会懂”的瞬间，你都能稳稳接住。你不是路过，你是把直播间当成固定坐标的人：更新、抽周边、十万粉冲刺的承诺、字幕颜色这些小线索，在你眼里都是可被验证的证据链。继续保持这种“既认真又好玩”的热情：该催更就催更，该支持就支持，最重要的是别忘了快乐本身。今晚，紫色霓虹为你点亮。",
    };
  }

  if (pct >= 0.8) {
    return {
      level: "铁杆粉丝",
      comment:
        "你的纯度很高：大部分题目都能秒答，说明你确实长期关注过，也能记住主播的高频梗与关键节点。你对内容的理解不止停留在“看过”，而是能把许多片段串成一条线——从日常直播的习惯到视频里埋的彩蛋，都有印象。接下来想更进一步也很简单：多参与几次直播互动，多翻翻旧切片，把那些容易忽略的小细节补齐。保持理性支持、适度玩梗，你就是最稳的那类常驻。",
    };
  }

  if (pct >= 0.6) {
    return {
      level: "稳定常驻",
      comment:
        "你属于“看得挺勤、梗也能接”的类型：核心信息基本掌握，偶尔有几题卡一下，多半是因为细节没刻意去记。总体来说，你已经不是纯路人了——能说出一些固定称呼、能对直播内容有基本画像，这就说明你在持续关注。建议你把答错的题当成“补课清单”：下次看到相关话题时多留意两眼，慢慢就能从常驻进化到铁杆。别急，纯度是陪伴与记忆叠出来的。",
    };
  }

  if (pct >= 0.3) {
    return {
      level: "云粉路过",
      comment:
        "你对主播有一定印象：能答对几题，说明确实刷到过视频/直播，也接触过一些代表性内容；但更多题目像是“似曾相识却想不起来”。这很正常——说明你目前还在浅层关注阶段：知道人设氛围，但对细节梗、里程碑事件还不够熟。想提升纯度的话，可以从最舒服的方式开始：挑自己喜欢的系列多看几期，遇到经典梗就顺手记一下。别强行卷，快乐才是最好的粘合剂。",
    };
  }

  return {
    level: "纯路人",
    comment:
      "你现在更像是“路过看到很有趣就点进来”的观众：题目里很多细节你可能还没接触到，或者只在某个片段里一闪而过。别担心，这不是扣分项——恰恰说明你还有很大的“入坑空间”。如果你愿意继续了解，推荐先从最新内容入手，顺带看看高光切片，慢慢建立起对主播风格、常用梗、以及关键事件的认知地图。等你下次再来测，分数自然会像霓虹一样一路上扬。",
  };
}

function showResult() {
  quizCard.classList.add("is-hidden");
  finalScoreEl.textContent = `你的最终得分是：${score} / ${questions.length}`;
  resultCard.classList.remove("is-hidden");

  const percent = questions.length === 0 ? 0 : Math.round((score / questions.length) * 100);
  if (meterFillEl) meterFillEl.style.width = `${percent}%`;

  const { level, comment } = getLevelAndComment(score, questions.length);
  if (resultLevelEl) resultLevelEl.textContent = `粉丝纯度评级：${level}`;
  if (resultCommentEl) resultCommentEl.textContent = comment;
}

function restart() {
  currentIndex = 0;
  score = 0;
  isTransitioning = false;
  resultCard.classList.add("is-hidden");
  quizCard.classList.remove("is-hidden");
  if (meterFillEl) meterFillEl.style.width = "0%";
  renderQuestion();
}

restartBtn.addEventListener("click", restart);

// 页面加载后首次渲染
renderQuestion();

