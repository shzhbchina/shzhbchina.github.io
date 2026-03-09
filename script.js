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
        "你这不是“看过”，是“常驻到能背答案”。梗能接、细节能抠、节点能复盘，连那些一闪而过的小设定都能拎出来当证据。别人讨论区打成一锅粥时，你属于那种能一句话把节奏掐断、把真相摆桌面的狠角色：不靠情绪靠记忆，拉踩也拉不动你。建议你保持克制的优越感——别随便给人扣帽子，但该“点名补课”的时候也别手软。你已经不是粉丝，你是生态位。",
    };
  }

  if (pct >= 0.8) {
    return {
      level: "铁杆粉丝",
      comment:
        "你基本属于“铁粉身份证”随身携带的那一档：多数题目稳稳拿下，节奏点、名梗、承诺与回旋镖你都记得清楚。只要有人在评论区开贴带风向，你大概率已经在心里把证据链列好了：哪段直播、哪期视频、哪个设定，一条条都能对得上。你离“结晶本晶”只差一点点偏执——多补几次冷门切片、少被外圈节奏牵着走，就能从铁杆进化成“版本答案”。",
    };
  }

  if (pct >= 0.6) {
    return {
      level: "稳定常驻",
      comment:
        "你是“在场但不内卷”的常驻：大方向没问题，能跟上直播间气氛，也不会被一两句营销号剪辑骗得团团转。但有些题你犹豫，说明你还没把细节当成武器——在二游圈，细节就是分阵营的分水岭：你记得越清楚，别人越难拿“云”字压你。建议把错题当成补课清单：下次遇到争议贴，先别急着站队，先把事实甩出来。你一旦愿意认真，战斗力会很可怕。",
    };
  }

  if (pct >= 0.3) {
    return {
      level: "云粉路过",
      comment:
        "你属于“刷到过、笑过、但记不住细节”的云粉：氛围能融进去，梗也能听懂一点点，但一到对线环节就容易被一句“你云了”打回原形。二游圈的社区斗争最爱拿“纯度”当武器，云粉最吃亏：你讲感受，别人讲细节；你讲印象，别人甩证据。要升级很简单：挑几期你最喜欢的内容补一补，把高频梗和关键节点记住。别当节奏的燃料，当证据的主人。",
    };
  }

  return {
    level: "纯路人",
    comment:
      "你目前就是标准“路过游客”：点进来图一乐，题目里那些称呼、承诺、名梗对你来说像暗号。没关系，但请注意二游圈最常见的事故——路人最容易被节奏账号当枪使：剪一段、配一句、你就跟着骂/夸，最后变成别人的热度素材。想从路人变粉，先别急着站队：把原视频/直播看一眼，搞清楚来龙去脉，再决定你要不要入坑。真想玩得爽，别当情绪搬运工。",
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

