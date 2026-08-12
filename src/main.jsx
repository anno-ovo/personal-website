import React, { Suspense, lazy, useEffect, useLayoutEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BorderGlow from './components/BorderGlow';
import ScrollStack, { ScrollStackItem } from './components/ScrollStack';
import profilePhoto from './assets/profile-photo.jpg';
import personalLogo from './assets/personal-logo.png';
import wechatHoverImage from './assets/wechat-hover.png';
import heyanfuProject from './assets/heyanfu-project.png';
import nanyushanProject from './assets/nanyushan-project.png';
import zhoushanSignageProject from './assets/zhoushan-signage-project.png';
import './styles.css';

gsap.registerPlugin(ScrollTrigger);

const HeroLanyard = lazy(() => import('./components/HeroLanyard'));

class LanyardErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.warn('Hero lanyard failed to load:', error);
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

const glowColors = ['#8ee8df', '#9fb8ff', '#e8f3ef'];
const glowBaseProps = {
  glowColor: '176 72 72',
  colors: glowColors,
  fillOpacity: 0.22,
};

const heyanfuDetailImporters = import.meta.glob('./assets/heyanfu-detail/*.jpg');
const nanyushanDetailImporters = import.meta.glob('./assets/nanyushan-detail/*.jpg');
const huanlehaiwanDetailImporters = import.meta.glob('./assets/huanlehaiwan-detail/*.jpg');
const fuxishanCover = new URL('./assets/fuxishan-cover.jpg', import.meta.url).href;
const fuxishanFilm = new URL('./assets/fuxishan-film.mp4', import.meta.url).href;

const contact = {
  phone: '19049588249',
  email: 'wslbbrg@qq.com',
  wechat: 'anno-ovo',
  city: 'Ningbo, CN',
};

const stats = [
  ['5+', '视觉项目经验'],
  ['30+', '品牌 / 空间 / 活动项目'],
  ['4', '品牌 / 影像 / 空间 / 印刷'],
  ['0-1', '策划 / 落地 / 执行'],
];

const projects = [
  {
    title: '和晏府户外围挡包装',
    type: 'Brand Visual / Real Estate',
    meta: '宁波轨道置业',
    image: heyanfuProject,
    summary: '以城市界面为媒介，完成户外围挡、道旗、海报等线下系统设计，让地产项目在街区尺度形成统一识别。',
  },
  {
    title: '「南屿山高」诸乐三作品鉴藏暨中青年写意画作品集',
    type: 'Exhibition Publication / Art Catalog',
    meta: 'Catalog design + layout system',
    image: nanyushanProject,
    summary: '围绕展览与作品内容，完成书籍的版式、节奏与图文关系梳理，让传统书画以更现代的视觉方式呈现。',
  },
  {
    title: '舟山欢乐海湾导向标识标牌深化设计',
    type: 'Wayfinding System / Public Space',
    meta: 'Zhoushan Huanle Haiwan',
    image: zhoushanSignageProject,
    summary: '围绕商业与公共空间动线，完成导向标识、层级信息与落地系统深化，让空间识别更清晰、统一。',
  },
  {
    title: '伏羲山 4A 景区年度品牌宣传片',
    type: 'Commercial Film / Tourism',
    meta: 'Director of photography + editor',
    image: fuxishanCover,
    summary: '通过镜头节奏、场景组织与色彩控制，提炼文旅目的地的自然氛围与度假质感。',
  },
];

const strengths = [
  {
    label: 'Tech Base',
    title: '深厚的技术根基',
    copy: '精通高精度艺术数据采集与处理、专业级艺术微喷输出和高端图像处理，能把基础工艺、色彩还原与输出品质做扎实。',
  },
  {
    label: 'Visual Range',
    title: '多维视觉延展',
    copy: '从品牌视觉到空间叙事，再到影像与活动现场，能把不同类型的项目统一成可落地的视觉系统。',
  },
  {
    label: 'Event Control',
    title: '活动全周期控制',
    copy: '能把年会、典礼、赛事和庆典类项目从前期策划到现场执行完整串起来，形成 0-1 的闭环。',
  },
  {
    label: 'Design Systems',
    title: '系统化设计思维',
    copy: '习惯把统一规范、媒介触点和现场尺度放在一起看，让视觉输出更稳定，也更容易复制。',
  },
  {
    label: 'Complex Clients',
    title: '高强度客户协作',
    copy: '面对地产、医院、部队和展陈类客户，能快速适应规范、节奏和审批链路的复杂要求。',
  },
  {
    label: 'Space Systems',
    title: '专业空间视觉系统',
    copy: '擅长把医院、展馆、景区和街区等场景转化成有秩序、可识别的空间视觉方案。',
  },
  {
    label: 'Hybrid Role',
    title: '设计 + 执行复合能力',
    copy: '既能做前端视觉，也能参与供应链、落地和现场执行，减少沟通断层。',
  },
  {
    label: 'Transition',
    title: '转型适应力',
    copy: '从传统设计到 AI 工具，再到动态影像与空间视觉，都能保持比较快的学习和切换能力。',
  },
  {
    label: 'Growth Mindset',
    title: '持续成长型心态',
    copy: '愿意把审美判断、技术工艺和现场复杂度一起消化，并持续把经验转成更稳定的输出。',
  },
];

const experience = [
  ['2025.08 - 2026.03', '浙江翔龙文化传播有限公司', '品牌视觉设计师'],
  ['2024.08 - 2025.03', '宁波市乾诚广告有限公司', '设计师 / 全链路活动 / 策划助理'],
  ['2023.07 - 2024.07', '郑州莱楚文化传媒有限公司', '设计师 / 摄像 / 摄影助理'],
  ['2021.12 - 2023.06', '杭州观象文化艺术策划有限公司', '设计师 / 摄像 / 高精度艺术数据采集'],
];

const workSystems = [
  {
    period: '2025.08 - 2026.03',
    company: '浙江翔龙文化传播有限公司',
    role: '品牌视觉设计师',
    overview: [
      '深耕品牌视觉全案策划与落地执行，擅长从0到1构建完整的视觉识别体系（VI），涵盖LOGO、主KV、户外围挡、道旗及宣传海报等全场景物料设计，确保品牌调性在线下多元渠道中的高度统一与精准呈现。在具体执行中，能够根据品牌定位提炼核心视觉符号，并针对不同媒介特性进行材质与工艺的适配优化，保障设计概念从屏幕到实物的无缝转化，最终形成可沉淀的品牌视觉资产。',
      '精通展览展示与空间视觉一体化设计，统筹文化展厅、部队文化长廊、医疗机构宣教空间等项目，具备从概念方案构思、效果图深化、施工图审核到现场搭建落地的全流程管理能力。在空间设计中坚持视觉语言与功能定位的深度融合，兼顾美学表达与信息传达效率，使每一处空间既具备艺术感染力，又能清晰传递客户的核心价值主张。',
      '具备全链路项目统筹协同能力，高效对接政府、医院、国企等高要求客户，精准理解不同体制背景下的传播语境与合规标准，在创意边界与安全红线之间寻求最佳平衡点。擅长联动外部供应商与内部设计团队，建立高效的沟通与反馈机制，全程严格把控项目成本预算、交付周期及最终成品质感，以专业执行力持续输出超越客户预期的视觉解决方案。',
    ],
    overviewProjects: [
      '宁波轨道交通集团地产「和晏府」户外围挡包装（视觉主创）',
      '宁波海军部队、嘉兴汽车连文化长廊建设项目（策划 + 视觉统筹）',
      '宁波开放大学、鄞州区首南小学宣教点视觉氛围整套方案（独立设计 + 现场落地）',
    ],
    overviewProjectsPlacement: 'projects',
    projects: [
      '宁波第九人民医院、大榭开发区医院、北仑人民医院肿瘤防治中心医疗宣传视觉设计（独立设计）',
      '江北城投文化墙设计及现场落地执行',
    ],
    skills: ['品牌全案策划', 'VI / SI', '空间导视', '展览展示', '项目统筹', '供应商沟通', 'PS 视觉合成', 'AI 矢量绘制'],
  },
  {
    period: '2024.08 - 2025.03',
    company: '宁波市乾诚广告有限公司',
    role: '设计师 / 全链路活动 / 策划助理',
    overview: [
      '在活动全周期管理层面，深度介入项目前期调研与客户需求解构，精准锚定活动目标与受众心理预期；具备独立完成从概念策划、预算编制、供应商遴选、场地动线规划到现场流程管控与应急预案制定的0-1全链路执行能力，确保企业年会、行业典礼、全国赛事等高规格活动的高品质落地与口碑闭环。',
      '在视觉体系构建上，擅长捕捉品牌内核的差异化符号，将抽象的活动理念与品牌基因转化为极具辨识度的主KV视觉语言，并系统化延展至LOGO、道旗、海报、伴手礼及空间氛围物料等全场景衍生设计，强化活动品牌的整体叙事力与沉浸感。',
      '在资源统筹与跨域协作层面，拥有成熟的政商学界沟通协调经验，能够精准适配政府机构、高等院校、金融机构及商会企业的不同传播语境与合规标准，在把控视觉调性与内容安全的基础上融合创意亮点，成功助力客户提升社会公信力与行业影响力。',
    ],
    projects: [
      '2024年浦发银行宁波分行30周年客户答谢会（总执行 / 视觉总监）',
      '“和合杯”全国青少年语言文化交流活动（视觉负责人）',
      '宁波市菏泽商会成立大会（策划执行）',
      '2024年“甬保杯”大学生保险论文大赛（视觉执行落地）',
      '江北宁波大学校友会换届大会（视觉主设计 / 活动执行）',
    ],
    skills: ['活动策划执行', '高规格典礼流程设计', '政商嘉宾动线管理', '应急预案制定', '供应商全域协调', '主视觉符号化创作', '动态视觉包装', 'PPT 数据可视化'],
  },
  {
    period: '2023.07 - 2024.07',
    company: '郑州莱楚文化传媒有限公司',
    role: '设计师 / 摄像 / 摄影助理',
    overview: [
      '精通商业级人物肖像、产品广告及空间场景摄影，具备从前期创意策划、分镜脚本拟定、现场灯光布控到最终成片输出的完整执行能力。在拍摄端熟练掌握全画幅相机系统、专业影棚灯光布局及三轴稳定器等设备，能够根据不同拍摄对象（人物、产品、空间）灵活调整技术方案，精准捕捉主体气质与场景氛围，确保每一帧画面兼具商业价值与艺术表现力。',
      '深度掌握图片精修（Adobe Photoshop）与宣传片剪辑（Adobe Premiere Pro）技术，建立从Raw格式处理、色彩分级到多轨道剪辑、音画同步、节奏把控的标准化后期流程，确保作品达到品牌传播级标准。擅长将客户抽象的传播诉求转化为具象的高视觉冲击力影像语言，在文旅推广、酒店品牌升级、教育研学等多元化领域积累了丰富案例，以影像叙事助力客户实现品牌曝光与市场转化。',
    ],
    projects: [
      '伏羲山国家4A景区年度品牌宣传片（主摄 / 剪辑）',
      '榆林天宝大酒店（四星级）品牌形象升级项目（首席摄影）',
      '林州红旗渠研学基地·红色教育主题宣传片（主摄 / 后期指导）',
    ],
    skills: ['宣传片剪辑叙事（PR）', '基础调色 / LUT 应用', '音画同步', '快剪节奏把控', '熟练操作全画幅相机系统', '影棚灯光布置', '三轴稳定器', '专业级监视器校色'],
  },
  {
    period: '2021.12 - 2023.06',
    company: '杭州观象文化艺术策划有限公司',
    role: '设计师 / 摄影 / 高精度艺术数据采集',
    overview: [
      '深耕高精度艺术数据采集与复刻（书画扫描、古籍数字化）及专业级艺术微喷输出，确保作品色彩与细节的完美还原。精通艺术展览全流程策划与执行，涵盖空间设计、展陈规划及宣传推广。具备专业出版级艺术书籍排版设计能力，熟练运用Adobe InDesign等工具。同时主导艺术类小程序拍卖平台运营，开展成人书法与国画培训课程设计与宣传，并擅长艺术衍生品创意开发。',
      '技术能力覆盖专业级视频拍摄制作与全流程后期（DaVinci Resolve、Premiere Pro，剪映）及高端图像处理与色彩管理（精通Photoshop、Capture One）。',
    ],
    overviewProjects: [
      '国家版本馆杭州分馆古籍数据采集、艺术微喷复刻项目',
      '「湘湖印象」张谷旻师生写生作品展画册排版设计（2022.06.25）',
      '第八届 “西湖之春” 全国青少年书法大赛画册排版设计（2022.07.30）',
    ],
    projects: [
      '「南屿山高」诸乐三作品鉴藏暨中青年写意画邀请展画册设计（2022.10.18）',
      '「喜迎二十大，永远跟党走」浙江省政协系统书画作品展画册排版设计（2022.10.13）',
      '「有时写字」壬寅宋宴雅集暨孙善春书法展画册设计（2022.11.17）',
      '「岭上白云」白云立个人画展画册设计（2023.02.11）',
      '「寒味芳心」历代梅花名家作品展画册设计（2023.03.15）',
      '浙江省文史馆马一浮雕像揭幕仪式视觉设计、执行策划、现场摄像（2023.04.15）',
    ],
    skills: ['平面设计', '摄影摄像', '版式设计', '展陈设计', '高端数据采集与处理', '专业影像输出', '设计与排版', '动态影像制作'],
  },
];
function useImportedImages(importers, { sliceStart = 0, sliceEnd = undefined, excludePageNumbers = [], excludeFileNames = [] } = {}) {
  const [images, setImages] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const entries = Object.entries(importers)
        .sort(([a], [b]) => a.localeCompare(b, 'zh-CN', { numeric: true }))
        .slice(sliceStart, sliceEnd);

      const urls = [];

      for (const [path, importer] of entries) {
        const match = path.match(/_页面_(\d+)\.jpg$/);
        if (match && excludePageNumbers.includes(match[1])) continue;
        if (excludeFileNames.some((name) => path.endsWith(name))) continue;

        const mod = await importer();
        urls.push(mod.default);
      }

      if (!cancelled) setImages(urls);
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [excludeFileNames, excludePageNumbers, importers, sliceEnd, sliceStart]);

  return images;
}

const homeReturnStateKey = 'soundshape:home-return-state';
const detailRouteHashes = new Set(['#/projects/heyanfu', '#/projects/nanyushan', '#/projects/huanlehaiwan', '#/projects/fuxishan']);

function saveHomeReturnState() {
  try {
    window.sessionStorage.setItem(homeReturnStateKey, JSON.stringify({ scrollY: window.scrollY || 0 }));
  } catch {
    // ignore
  }
}

function readHomeReturnState() {
  try {
    const raw = window.sessionStorage.getItem(homeReturnStateKey);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function clearHomeReturnState() {
  try {
    window.sessionStorage.removeItem(homeReturnStateKey);
  } catch {
    // ignore
  }
}

function goHome() {
  scrollToHashTarget('#top');
  setHashRoute('#top');
}

const navigationClickGuard = {
  hash: '',
  time: 0,
};

function markNavigation(hash) {
  navigationClickGuard.hash = hash;
  navigationClickGuard.time = Date.now();
}

function shouldSkipDuplicateNavigation(hash) {
  return navigationClickGuard.hash === hash && Date.now() - navigationClickGuard.time < 700;
}

function scrollToHashTarget(hash) {
  const targetId = hash.replace(/^#/, '');

  if (!targetId || targetId === 'top') {
    forceWindowScrollStart();
    return;
  }

  const target = document.getElementById(targetId);
  if (!target) return;

  const navOffset = 104;
  const targetY = Math.max(0, Math.round(target.getBoundingClientRect().top + window.scrollY - navOffset));
  window.scrollTo({ top: targetY, left: 0, behavior: 'auto' });
}

function setHashRoute(hash) {
  const nextHash = hash || '#top';

  if (window.location.hash === nextHash) {
    window.history.replaceState(null, '', nextHash);
  } else {
    window.history.pushState(null, '', nextHash);
  }

  window.dispatchEvent(new Event('hashchange'));
}

function navigateHash(event, hash) {
  event.preventDefault();
  if (event.type === 'click' && shouldSkipDuplicateNavigation(hash)) return;
  scrollToHashTarget(hash);
  setHashRoute(hash);
  markNavigation(hash);
}

function navigateHashPress(event, hash) {
  if (event.button !== 0) return;
  event.preventDefault();
  scrollToHashTarget(hash);
  setHashRoute(hash);
  markNavigation(hash);
}

function navigateProject(event, hash) {
  event.preventDefault();
  if (event.type === 'click' && shouldSkipDuplicateNavigation(hash)) return;
  saveHomeReturnState();
  scrollToHashTarget(hash);
  setHashRoute(hash);
  markNavigation(hash);
}

function navigateProjectPress(event, hash) {
  if (event.button !== 0) return;
  event.preventDefault();
  saveHomeReturnState();
  scrollToHashTarget(hash);
  setHashRoute(hash);
  markNavigation(hash);
}

function forceWindowScrollStart() {
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

function resetDetailScrollToTop() {
  forceWindowScrollStart();

  window.requestAnimationFrame(() => {
    forceWindowScrollStart();
    window.requestAnimationFrame(() => {
      forceWindowScrollStart();
    });
  });
}

function scheduleScrollTriggerRefresh() {
  if (scheduleScrollTriggerRefresh.rafId) return;

  scheduleScrollTriggerRefresh.rafId = window.requestAnimationFrame(() => {
    scheduleScrollTriggerRefresh.rafId = 0;
    ScrollTrigger.refresh();
  });
}
scheduleScrollTriggerRefresh.rafId = 0;

function revealHeroFallback() {
  const selectors = [
    '.openingCurtain',
    '.nav',
    '.hero .kicker',
    '.hero h1',
    '.heroGreeting',
    '.heroTagline',
    '.heroVideo',
    '.scanField',
    '.grain',
    '.heroMeta .border-glow-card',
  ];

  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element) => {
      if (selector === '.openingCurtain') {
        element.style.display = 'none';
        element.style.pointerEvents = 'none';
        element.style.opacity = '0';
        element.style.visibility = 'hidden';
        return;
      }

      element.style.opacity = '';
      element.style.visibility = '';
      element.style.clipPath = '';
      element.style.transform = '';
      element.style.filter = '';
    });
  });

  document.body.classList.add('motion-ready');
}

function usePortfolioMotion(skipOpening = false) {
  useLayoutEffect(() => {
    const fallbackTimer = window.setTimeout(revealHeroFallback, 1800);

    let ctx;

    try {
      ctx = gsap.context(() => {
        gsap.defaults({ ease: 'power4.out', force3D: true });

      gsap.set('.nav', { autoAlpha: 1, y: 0 });
      gsap.set('.hero .kicker', { autoAlpha: 1, y: 0 });
      gsap.set('.heroLanyard', { autoAlpha: 1, y: 0, scale: 1 });
      gsap.set('.heroMeta .border-glow-card', { autoAlpha: 1, y: 0 });
      gsap.set('.hero h1', { clipPath: 'inset(0 0 0% 0)', y: 0, scaleY: 1, transformOrigin: '50% 100%' });
      gsap.set('.heroGreeting, .heroTagline', { clipPath: 'inset(0 0 0% 0)', y: 0, scaleY: 1, transformOrigin: '50% 100%' });
      gsap.set('.heroVideo', { scale: 1.04, filter: 'grayscale(1) contrast(1.18) brightness(0.46)' });
      gsap.set('.scanField', { xPercent: 0, autoAlpha: 0.72 });
      gsap.set('.grain', { autoAlpha: 0.22 });
      gsap.set('.openingCurtain', { autoAlpha: 0 });

      if (!skipOpening) {
        const opening = gsap.timeline({ delay: 0.2 });
        opening
          .fromTo('.openingCurtain', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 0)
          .fromTo('.openingCurtain span', { yPercent: 120, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.65, ease: 'expo.out' }, 0)
          .fromTo('.openingCurtain i', { scaleX: 0, transformOrigin: '0% 50%' }, { scaleX: 1, duration: 0.7, ease: 'expo.inOut' }, 0.05)
          .to('.openingCurtain', { clipPath: 'inset(0 0 100% 0)', duration: 0.65, ease: 'expo.inOut' }, 0.42)
          .set('.openingCurtain', { display: 'none', autoAlpha: 0 })
          .to('.grain', { autoAlpha: 0.22, duration: 0.5 }, 0)
          .to('.scanField', { autoAlpha: 0.72, xPercent: 0, duration: 0.8, ease: 'expo.out' }, 0)
          .to('.heroVideo', { scale: 1.04, filter: 'grayscale(1) contrast(1.18) brightness(0.46)', duration: 1.1, ease: 'power3.out' }, 0)
          .to('.nav', { autoAlpha: 1, y: 0, duration: 0.4 }, 0.08)
          .to('.hero .kicker', { autoAlpha: 1, y: 0, duration: 0.35 }, 0.12)
          .to('.hero h1', { clipPath: 'inset(0 0 0% 0)', y: 0, scaleY: 1, duration: 0.55, ease: 'expo.out' }, 0.18)
          .to('.heroGreeting, .heroTagline', { clipPath: 'inset(0 0 0% 0)', y: 0, scaleY: 1, duration: 0.5, stagger: 0.06, ease: 'expo.out' }, 0.26)
          .fromTo('.heroLanyard', { autoAlpha: 0, y: -120, scale: 0.99 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.32, ease: 'back.out(1.1)' }, 0.32)
          .to('.heroMeta .border-glow-card', { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.05 }, 0.34);
      }

      const titleTargets = gsap.utils.toArray('.profileCopy h2, .experienceDepth .sectionHeader h2, .works .sectionHeader h2, .strengths .sectionHeader h2, .finalInner h2');
      gsap.set(titleTargets, { clipPath: 'inset(0 0 100% 0)', y: 120, scaleY: 0.7, transformOrigin: '50% 100%' });
      titleTargets.forEach((title) => {
        gsap.to(title, {
          clipPath: 'inset(0 0 0% 0)',
          y: 0,
          scaleY: 1,
          duration: 1.35,
          ease: 'expo.out',
          scrollTrigger: { trigger: title, start: 'top 82%', once: true },
        });
      });

      const profileItems = gsap.utils.toArray('.portraitPanel, .profileCopy > p:not(.sectionLabel), .contactChip, .stat, .timeline article');
      gsap.set(profileItems, { autoAlpha: 0, y: 86, clipPath: 'inset(18% 0 0 0)' });
      gsap.to(profileItems, {
        autoAlpha: 1,
        y: 0,
        clipPath: 'inset(0% 0 0 0)',
        duration: 1.25,
        stagger: 0.08,
        scrollTrigger: { trigger: '#profile', start: 'top 70%', once: true },
      });

      gsap.set('.experienceCard', { autoAlpha: 0, y: 120, scaleY: 0.88, clipPath: 'inset(18% 0 10% 0)', transformOrigin: '50% 100%' });
      gsap.set('.experienceProject, .skillTag', { autoAlpha: 0, y: 34 });
      gsap.to('.experienceCard', {
        autoAlpha: 1,
        y: 0,
        scaleY: 1,
        clipPath: 'inset(0% 0 0% 0)',
        duration: 1.28,
        stagger: 0.14,
        scrollTrigger: { trigger: '.experienceGrid', start: 'top 76%', once: true },
      });
      gsap.to('.experienceProject, .skillTag', {
        autoAlpha: 1,
        y: 0,
        duration: 0.82,
        stagger: 0.025,
        scrollTrigger: { trigger: '.experienceGrid', start: 'top 68%', once: true },
      });

      gsap.set('.glowProject', { autoAlpha: 0, y: 150, clipPath: 'inset(20% 0 12% 0)' });
      gsap.to('.glowProject', {
        autoAlpha: 1,
        y: 0,
        clipPath: 'inset(0% 0 0% 0)',
        duration: 1.45,
        stagger: 0.16,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.projectRail', start: 'top 78%', once: true },
      });

      gsap.set('.glowStrength', { autoAlpha: 0, y: 110, scale: 0.94, clipPath: 'inset(18% 0 18% 0)' });
      gsap.to('.glowStrength', {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        clipPath: 'inset(0% 0 0% 0)',
        duration: 1.25,
        stagger: 0.1,
        scrollTrigger: { trigger: '.strengthGrid', start: 'top 78%', once: true },
        });

      gsap.set('.finalInner .sectionLabel, .finalActions .glowButton', { autoAlpha: 0, y: 76 });
      gsap.to('.finalInner .sectionLabel, .finalActions .glowButton', {
        autoAlpha: 1,
        y: 0,
        duration: 1.1,
        stagger: 0.12,
        scrollTrigger: { trigger: '.finalContact', start: 'top 70%', once: true },
      });
      });

      window.clearTimeout(fallbackTimer);
    } catch (error) {
      console.warn('Portfolio motion setup failed:', error);
      window.clearTimeout(fallbackTimer);
      revealHeroFallback();
    }

    return () => {
      window.clearTimeout(fallbackTimer);
      if (ctx) ctx.revert();
    };
  }, []);
}

function App() {
  const { hash: route, routeKey } = useHashRoute();
  const isDetailRoute = detailRouteHashes.has(route);

  return (
    <>
      {route === '#/projects/heyanfu' ? <HeYanFuDetailPage key={routeKey} routeKey={routeKey} /> : null}
      {route === '#/projects/nanyushan' ? <NanyushanDetailPage key={routeKey} routeKey={routeKey} /> : null}
      {route === '#/projects/huanlehaiwan' ? <HuanlehaiwanDetailPage key={routeKey} routeKey={routeKey} /> : null}
      {route === '#/projects/fuxishan' ? <FuxishanDetailPage key={routeKey} routeKey={routeKey} /> : null}
      {!isDetailRoute ? <HomePage route={route} /> : null}
    </>
  );
}

function HomePage({ route }) {
  const [skipOpening, setSkipOpening] = useState(() => Boolean(readHomeReturnState()));

  useLayoutEffect(() => {
    const restore = readHomeReturnState();
    if (!restore) return undefined;

    setSkipOpening(true);
    const targetY = Number(restore.scrollY) || 0;
    const raf = window.requestAnimationFrame(() => {
      window.scrollTo({ top: targetY, behavior: 'auto' });
      window.requestAnimationFrame(() => {
        scheduleScrollTriggerRefresh();
        clearHomeReturnState();
      });
    });

    return () => window.cancelAnimationFrame(raf);
  }, []);

  useLayoutEffect(() => {
    if (!route || route === '#top' || detailRouteHashes.has(route)) return undefined;

    const raf = window.requestAnimationFrame(() => {
      scrollToHashTarget(route);
      scheduleScrollTriggerRefresh();
    });

    return () => window.cancelAnimationFrame(raf);
  }, [route]);

  usePortfolioMotion(skipOpening);

  return (
    <>
      <div className={`openingCurtain ${skipOpening ? 'isHidden' : ''}`} aria-hidden="true">
        <span>SoundShape / Portfolio System</span>
        <i />
      </div>
      <SiteNav />
      <main>
        <Hero />
        <Profile />
        <WorkExperience />
        <Projects />
        <Strengths />
        <Contact />
      </main>
    </>
  );
}

function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash || '');
  const [routeKey, setRouteKey] = useState(() => `${window.location.hash || 'home'}-${Date.now()}`);

  useLayoutEffect(() => {
    const handleHashChange = () => {
      const nextHash = window.location.hash || '';

      if (detailRouteHashes.has(nextHash)) {
        window.history.scrollRestoration = 'manual';
        forceWindowScrollStart();
      }

      setHash(nextHash);
      setRouteKey(`${nextHash || 'home'}-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useLayoutEffect(() => {
    if (detailRouteHashes.has(hash)) scheduleScrollTriggerRefresh();
  }, [hash]);

  return { hash, routeKey };
}

function HeYanFuDetailPage({ routeKey }) {
  const [stackKey, setStackKey] = useState(0);
  const heyanfuDetailImages = useImportedImages(heyanfuDetailImporters, {
    sliceStart: 1,
    sliceEnd: -1,
    excludePageNumbers: ['19', '22', '25', '28', '32', '37'],
  });

  const handleBackHome = (event) => {
    event.preventDefault();
    goHome();
  };

  useLayoutEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    document.body.classList.add('isDetailRoute');
    resetDetailScrollToTop();
    setStackKey((key) => key + 1);

    const resetFrame = window.requestAnimationFrame(() => {
      resetDetailScrollToTop();
      scheduleScrollTriggerRefresh();
    });

    return () => {
      window.cancelAnimationFrame(resetFrame);
      window.history.scrollRestoration = previousScrollRestoration;
      document.body.classList.remove('isDetailRoute');
      scheduleScrollTriggerRefresh();
    };
  }, []);

  return (
    <div className="detailPage">
      <header className="detailHero">
        <div className="wrap detailNav">
          <a className="detailBack" href="#top" onClick={handleBackHome}>← 返回首页</a>
          <div className="detailMeta">和晏府户外围挡包装</div>
        </div>
        <div className="wrap detailIntro">
          <p className="sectionLabel">Project detail</p>
          <h1>和晏府户外围挡包装</h1>
          <p>生活化艺术、沉浸式场景、内敛式品质</p>
        </div>
      </header>
      <main className="detailGallery" aria-label="和晏府户外围挡包装方案图">
        <ScrollStack
          key={`${routeKey}-${stackKey}`}
          className="detailStack"
          itemDistance={150}
          itemScale={0}
          itemStackDistance={0}
          stackPosition="50%"
          scaleEndPosition="5%"
          baseScale={0.98}
          rotationAmount={0}
          blurAmount={0}
          useWindowScroll
        >
          {heyanfuDetailImages.map((src, index) => (
            <ScrollStackItem itemClassName="detailFigure" key={src}>
              <img src={src} alt={`和晏府方案 ${index + 1} 页`} loading="lazy" />
            </ScrollStackItem>
          ))}
        </ScrollStack>
        <a className="detailReturnHome" href="#top" onClick={handleBackHome}>返回首页</a>
      </main>
    </div>
  );
}

function HuanlehaiwanDetailPage({ routeKey }) {
  const [stackKey, setStackKey] = useState(0);
  const huanlehaiwanDetailImages = useImportedImages(huanlehaiwanDetailImporters, {
    sliceStart: 1,
    sliceEnd: -1,
    excludeFileNames: ['-_页面_71.jpg', '-_页面_72.jpg', '-_页面_74.jpg', '-_页面_75.jpg'],
  });

  const handleBackHome = (event) => {
    event.preventDefault();
    goHome();
  };

  useLayoutEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    document.body.classList.add('isDetailRoute');
    resetDetailScrollToTop();
    setStackKey((key) => key + 1);

    const resetFrame = window.requestAnimationFrame(() => {
      resetDetailScrollToTop();
      scheduleScrollTriggerRefresh();
    });

    return () => {
      window.cancelAnimationFrame(resetFrame);
      window.history.scrollRestoration = previousScrollRestoration;
      document.body.classList.remove('isDetailRoute');
      scheduleScrollTriggerRefresh();
    };
  }, []);

  return (
    <div className="detailPage huanlehaiwanDetailPage">
      <header className="detailHero">
        <div className="wrap detailNav">
          <a className="detailBack" href="#top" onClick={handleBackHome}>← 返回首页</a>
          <div className="detailMeta">舟山欢乐海湾导向标识标牌深化设计</div>
        </div>
        <div className="wrap detailIntro">
          <p className="sectionLabel">Project detail</p>
          <h1>舟山欢乐海湾导向标识标牌深化设计</h1>
          <p>导向系统、空间识别、公共秩序</p>
        </div>
      </header>
      <main className="detailGallery huanlehaiwanGallery" aria-label="舟山欢乐海湾导向标识标牌深化设计方案图">
        <ScrollStack
          key={`${routeKey}-${stackKey}`}
          className="detailStack"
          itemDistance={150}
          itemScale={0}
          itemStackDistance={0}
          stackPosition="50%"
          scaleEndPosition="5%"
          baseScale={0.98}
          rotationAmount={0}
          blurAmount={0}
          useWindowScroll
        >
          {huanlehaiwanDetailImages.map((src, index) => (
            <ScrollStackItem itemClassName="detailFigure huanlehaiwanFigure" key={src}>
              <img src={src} alt={`舟山欢乐海湾导向标识方案 ${index + 1} 页`} loading="lazy" />
            </ScrollStackItem>
          ))}
        </ScrollStack>
        <a className="detailReturnHome" href="#top" onClick={handleBackHome}>返回首页</a>
      </main>
    </div>
  );
}

function NanyushanDetailPage({ routeKey }) {
  const [stackKey, setStackKey] = useState(0);
  const nanyushanDetailImages = useImportedImages(nanyushanDetailImporters, { sliceStart: 1, sliceEnd: -1 });

  const handleBackHome = (event) => {
    event.preventDefault();
    goHome();
  };

  useLayoutEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    document.body.classList.add('isDetailRoute');
    resetDetailScrollToTop();
    setStackKey((key) => key + 1);

    const resetFrame = window.requestAnimationFrame(() => {
      resetDetailScrollToTop();
      scheduleScrollTriggerRefresh();
    });

    return () => {
      window.cancelAnimationFrame(resetFrame);
      window.history.scrollRestoration = previousScrollRestoration;
      document.body.classList.remove('isDetailRoute');
      scheduleScrollTriggerRefresh();
    };
  }, []);

  return (
    <div className="detailPage bookDetailPage">
      <header className="detailHero">
        <div className="wrap detailNav">
          <a className="detailBack" href="#top" onClick={handleBackHome}>← 返回首页</a>
          <div className="detailMeta">南屿山高</div>
        </div>
        <div className="wrap detailIntro">
          <p className="sectionLabel">Project detail</p>
          <h1>「南屿山高」诸乐三作品鉴藏暨中青年写意画作品集</h1>
          <p>展览主题、作品秩序、图文节奏</p>
        </div>
      </header>
      <main className="detailGallery bookGallery" aria-label="南屿山高作品集方案图">
        <ScrollStack
          key={`${routeKey}-${stackKey}`}
          className="detailStack bookStack"
          itemDistance={150}
          itemScale={0}
          itemStackDistance={0}
          stackPosition="50%"
          scaleEndPosition="5%"
          baseScale={0.98}
          rotationAmount={0}
          pageTurnAmount={0}
          blurAmount={0}
          useWindowScroll
        >
          {nanyushanDetailImages.map((src, index) => (
            <ScrollStackItem itemClassName="detailFigure bookFigure" key={src}>
              <img
                src={src}
                alt={`南屿山高作品集第 ${index + 1} 页`}
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : 'auto'}
              />
            </ScrollStackItem>
          ))}
        </ScrollStack>
        <a className="detailReturnHome" href="#top" onClick={handleBackHome}>返回首页</a>
      </main>
    </div>
  );
}

function FuxishanDetailPage() {
  const handleBackHome = (event) => {
    event.preventDefault();
    goHome();
  };

  useLayoutEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    document.body.classList.add('isDetailRoute');
    document.body.classList.add('isVideoDetailRoute');
    resetDetailScrollToTop();

    const resetFrame = window.requestAnimationFrame(() => {
      resetDetailScrollToTop();
      scheduleScrollTriggerRefresh();
    });

    return () => {
      window.cancelAnimationFrame(resetFrame);
      window.history.scrollRestoration = previousScrollRestoration;
      document.body.classList.remove('isDetailRoute');
      document.body.classList.remove('isVideoDetailRoute');
      scheduleScrollTriggerRefresh();
    };
  }, []);

  return (
    <div className="detailPage videoDetailPage">
      <header className="detailHero">
        <div className="wrap detailNav">
          <a className="detailBack" href="#top" onClick={handleBackHome}>← 返回首页</a>
          <div className="detailMeta">伏羲山 4A 景区年度品牌宣传片</div>
        </div>
        <div className="wrap detailIntro">
          <p className="sectionLabel">Project detail</p>
          <h1>伏羲山 4A 景区年度品牌宣传片</h1>
          <p>文旅影像、空间质感、品牌传播</p>
        </div>
      </header>
      <main className="wrap videoDetailMain" aria-label="伏羲山宣传片详情">
        <div className="videoStage">
          <video className="projectVideo" src={fuxishanFilm} poster={fuxishanCover} controls playsInline preload="metadata" />
        </div>
        <div className="videoDetailCopy">
          <a className="detailReturnHome videoReturnHome" href="#top" onClick={handleBackHome}>返回首页</a>
        </div>
      </main>
    </div>
  );
}

function SiteNav() {
  const [navFloating, setNavFloating] = useState(false);

  useEffect(() => {
    const handleScroll = () => setNavFloating(window.scrollY > 4);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <nav className={`nav wrap ${navFloating ? 'isFloating' : ''}`} aria-label="主导航">
      <a className="brand" href="#top" aria-label="SoundShape 首页">
        <img src={personalLogo} alt="SoundShape" />
      </a>
      <div className="navLinks">
        <a href="#profile" onMouseDown={(event) => navigateHashPress(event, '#profile')} onClick={(event) => navigateHash(event, '#profile')}>关于</a>
        <a href="#experience" onMouseDown={(event) => navigateHashPress(event, '#experience')} onClick={(event) => navigateHash(event, '#experience')}>经历</a>
        <a href="#projects" onMouseDown={(event) => navigateHashPress(event, '#projects')} onClick={(event) => navigateHash(event, '#projects')}>作品</a>
        <a href="#strengths" onMouseDown={(event) => navigateHashPress(event, '#strengths')} onClick={(event) => navigateHash(event, '#strengths')}>能力</a>
      </div>
      <BorderGlow
        {...glowBaseProps}
        className="glowButton navGlowButton"
        edgeSensitivity={22}
        backgroundColor="rgba(9, 13, 15, 0.32)"
        borderRadius={999}
        glowRadius={18}
        glowIntensity={0.85}
        coneSpread={18}
      >
        <a className="contactButton" href="#contact" onMouseDown={(event) => navigateHashPress(event, '#contact')} onClick={(event) => navigateHash(event, '#contact')}>联系</a>
      </BorderGlow>
    </nav>
  );
}

function Hero() {
  const videoRefA = React.useRef(null);

  useEffect(() => {
    const videoA = videoRefA.current;
    if (!videoA) return undefined;

    const setupVideo = () => {
      videoA.playbackRate = 0.84;
      videoA.loop = true;
      videoA.currentTime = 0;
      void videoA.play();
    };

    const setupWhenReady = () => {
      if (videoA.readyState >= 1) setupVideo();
    };

    if (videoA.readyState >= 1) setupVideo();
    else videoA.addEventListener('loadedmetadata', setupWhenReady);

    return () => videoA.removeEventListener('loadedmetadata', setupWhenReady);
  }, []);

  return (
    <section className="hero" id="top" aria-label="首页">
      <LanyardErrorBoundary>
        <Suspense fallback={null}>
          <HeroLanyard />
        </Suspense>
      </LanyardErrorBoundary>
      <div className="videoBackdrop" aria-hidden="true">
        <video
          ref={videoRefA}
          className="heroVideo isActive"
          autoPlay
          muted
          playsInline
          preload="metadata"
          poster="https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=2400&q=82"
        >
          <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" />
        </video>
        <div className="scanField" />
        <div className="grain" />
      </div>

      <div className="heroContent wrap">
        <p className="kicker">视觉设计师 / AI 设计师 / 品牌设计师</p>
        <div className="heroTitleRow">
          <h1>
            <span className="heroGreeting">hi，我是<span className="handName">郑贾磊</span></span>
            <span className="heroTagline">从图像到空间，建立可落地的视觉系统。</span>
          </h1>
        </div>
        <div className="heroMeta">
          {['设计 / 摄影', '品牌视觉', '空间叙事', '动态影像', '策划执行'].map((item) => (
            <BorderGlow
              {...glowBaseProps}
              className="glowPill"
              key={item}
              edgeSensitivity={24}
              backgroundColor="rgba(9, 13, 15, 0.42)"
              borderRadius={999}
              glowRadius={18}
              glowIntensity={0.7}
              coneSpread={16}
            >
              <span>{item}</span>
            </BorderGlow>
          ))}
        </div>
      </div>
      <p className="heroCornerNote"><span>DESIGN</span><span>IS NOT DECORATION.</span></p>
    </section>
  );
}

function Profile() {
  return (
    <section className="section profile wrap" id="profile">
      <div className="portraitPanel">
        <img className="portraitPhoto" src={profilePhoto} alt="郑贾磊肖像" />
        <div className="portraitGlow" aria-hidden="true" />
        <div className="portrait"><span>郑贾磊</span></div>
      </div>
      <div className="profileCopy">
        <p className="sectionLabel">Profile</p>
        <h2>把视觉、影像、空间和执行压缩成一个稳定的交付系统。</h2>
        <p>
          拥有 5 年视觉设计项目经验。过去服务过地产、部队、医院、金融、院校、文旅等客户和项目，工作覆盖品牌视觉系统、空间文化长廊、活动主视觉、商业影像、艺术数字化采集与出版级排版。
        </p>
        <p>
          我的工作方式偏复合型：能做创意和视觉执行，也能处理前期提案、现场沟通、供应商协作和落地跟进。希望把成熟项目经验与 AI 设计方式结合，继续拓展品牌与空间视觉。
        </p>
        <div className="profileInfoStack">
          <div className="contactGrid" aria-label="联系方式">
            {[contact.phone, contact.email, contact.city].map((item) => (
              <span className="contactChip" key={item}>{item}</span>
            ))}
          </div>
          <div className="statGrid">
            {stats.map(([value, label]) => (
              <div className="stat" key={value}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="timeline" aria-label="个人经历">
        {experience.map(([date, company, role]) => (
          <article key={company}>
            <time>{date}</time>
            <h3>{company}</h3>
            <p>{role}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function WorkExperience() {
  return (
    <section className="section experienceDepth" id="experience">
      <div className="wrap sectionHeader">
        <div className="sectionMark logoAbove">
          <img src={personalLogo} alt="SoundShape" />
          <p className="sectionLabel">Work experience</p>
        </div>
        <h2>把每一段工作经历，展开成可被感知的设计系统与项目现场。</h2>
      </div>
      <div className="wrap experienceGrid">
        {workSystems.map((work, index) => (
          <article className="experienceCard" key={work.company}>
            <div className="experienceIndex">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <time>{work.period}</time>
            </div>
            <div className="experienceBody">
              <div className="experienceHead">
                <h3>{work.company}</h3>
                <p>{work.role}</p>
              </div>
              <div className="experienceOverview">
                <span>工作业务范围</span>
                {(Array.isArray(work.overview) ? work.overview : [work.overview]).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {work.overviewProjects && work.overviewProjectsPlacement !== 'projects' && (
                  <ul className="experienceOverviewProjects">
                    {work.overviewProjects.map((project) => (
                      <li className="experienceProject experienceProjectCompact" key={project}>{project}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="experienceProjects">
                <span>代表项目</span>
                <ul>
                  {work.overviewProjectsPlacement === 'projects' && work.overviewProjects?.map((project) => (
                    <li className="experienceProject" key={project}>{project}</li>
                  ))}
                  {work.projects.map((project) => (
                    <li className="experienceProject" key={project}>{project}</li>
                  ))}
                </ul>
              </div>
              <div className="experienceSkills">
                <span>专业能力</span>
                <div>
                  {work.skills.map((skill) => (
                    <em className="skillTag" key={skill}>{skill}</em>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Projects() {
  const projectLinks = {
    '和晏府户外围挡包装': '#/projects/heyanfu',
    '「南屿山高」诸乐三作品鉴藏暨中青年写意画作品集': '#/projects/nanyushan',
    '舟山欢乐海湾导向标识标牌深化设计': '#/projects/huanlehaiwan',
    '伏羲山 4A 景区年度品牌宣传片': '#/projects/fuxishan',
  };

  return (
    <section className="section works" id="projects">
      <div className="wrap sectionHeader">
        <div className="sectionMark logoAbove">
          <img src={personalLogo} alt="SoundShape" />
          <p className="sectionLabel">Selected works</p>
        </div>
        <h2>品牌、空间、活动、影像<br />都被整合进可落地的视觉系统。</h2>
      </div>
      <div className="projectRail wrap">
        {projects.map((project, index) => (
          <BorderGlow
            {...glowBaseProps}
            className="glowProject"
            key={project.title}
            edgeSensitivity={16}
            backgroundColor="#101418"
            borderRadius={8}
            glowRadius={32}
            glowIntensity={0.9}
            coneSpread={20}
          >
            {projectLinks[project.title] ? (
              <a
                className="projectCard projectCardLink"
                href={projectLinks[project.title]}
                aria-label={`查看${project.title}详情`}
                onMouseDown={(event) => navigateProjectPress(event, projectLinks[project.title])}
                onClick={(event) => navigateProject(event, projectLinks[project.title])}
              >
                <img src={project.image} alt="" loading="lazy" decoding="async" />
                <div className="projectShade" />
                <div className="projectText">
                  <div>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <p>{project.type}</p>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                  <small>{project.meta}</small>
                </div>
                <span className="projectHint">点击了解</span>
              </a>
            ) : (
              <article className="projectCard">
                <img src={project.image} alt="" loading="lazy" decoding="async" />
                <div className="projectShade" />
                <div className="projectText">
                  <div>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <p>{project.type}</p>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                  <small>{project.meta}</small>
                </div>
              </article>
            )}
          </BorderGlow>
        ))}
      </div>
    </section>
  );
}

function Strengths() {
  return (
    <section className="section strengths wrap" id="strengths">
      <div className="sectionHeader compact">
        <div className="sectionMark logoBelow">
          <p className="sectionLabel">Capability edge</p>
          <img src={personalLogo} alt="SoundShape" />
        </div>
        <h2>能力不是堆软件名，而是把审美判断、技术工艺和现场复杂度一起消化。</h2>
      </div>
      <div className="strengthGrid">
        {strengths.map((item) => (
          <BorderGlow
            {...glowBaseProps}
            className="glowStrength"
            key={item.label}
            edgeSensitivity={18}
            backgroundColor="rgba(17, 22, 24, 0.72)"
            borderRadius={8}
            glowRadius={28}
            glowIntensity={0.8}
            coneSpread={20}
          >
            <article className="strengthCard">
              <span>{item.label}</span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          </BorderGlow>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  const [wechatPreviewOpen, setWechatPreviewOpen] = useState(false);

  return (
    <section className="finalContact" id="contact">
      <div className="wrap finalInner">
        <p className="sectionLabel">Available for visual design / AI design / brand systems</p>
        <h2>让下一组视觉，从清晰的方向开始。</h2>
        <div className="finalActions">
          <BorderGlow {...glowBaseProps} className="glowButton" edgeSensitivity={22} backgroundColor="rgba(238, 242, 242, 0.08)" borderRadius={999} glowRadius={22} glowIntensity={0.8} coneSpread={18}>
            <a href={`mailto:${contact.email}`}><span>E-MAIL:</span>{contact.email}</a>
          </BorderGlow>
          <BorderGlow {...glowBaseProps} className="glowButton" edgeSensitivity={22} backgroundColor="rgba(238, 242, 242, 0.08)" borderRadius={999} glowRadius={22} glowIntensity={0.8} coneSpread={18}>
            <a href={`tel:${contact.phone}`}><span>TEL:</span>{contact.phone}</a>
          </BorderGlow>
          <div
            className="wechatActionWrap"
            onPointerEnter={() => setWechatPreviewOpen(true)}
            onPointerLeave={() => setWechatPreviewOpen(false)}
            onFocus={() => setWechatPreviewOpen(true)}
            onBlur={() => setWechatPreviewOpen(false)}
          >
            <BorderGlow {...glowBaseProps} className="glowButton" edgeSensitivity={22} backgroundColor="rgba(238, 242, 242, 0.08)" borderRadius={999} glowRadius={22} glowIntensity={0.8} coneSpread={18}>
              <span className="wechatItem"><span>WeChat:</span>{contact.wechat}</span>
            </BorderGlow>
            <div className={`wechatPopup ${wechatPreviewOpen ? 'isVisible' : ''}`} aria-hidden="true">
              <img src={wechatHoverImage} alt="WeChat QR code preview" />
            </div>
          </div>
        </div>
      </div>
      <p className="finalCornerNote" aria-hidden="true"><span>DESIGN</span><span>IS NOT DECORATION.</span></p>
    </section>
  );
}

createRoot(document.getElementById('root')).render(<App />);
