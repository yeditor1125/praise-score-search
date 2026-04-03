var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { extractKeyFromTitle } from "../keyUtils";
export var defaultSources = [
    {
        id: "music-in",
        name: "music-in tistory",
        url: "https://music-in.tistory.com/category/찬양팀 악보",
        type: "tistory",
        enabled: true
    },
    {
        id: "god-is-with-me",
        name: "god-is-with-me tistory",
        url: "https://god-is-with-me.tistory.com/category/찬양악보",
        type: "tistory",
        enabled: true
    },
    {
        id: "godinthebible",
        name: "godinthebible naver",
        url: "https://blog.naver.com/godinthebible",
        type: "naver",
        enabled: true
    },
    {
        id: "relishsky",
        name: "relishsky naver",
        url: "https://m.blog.naver.com/PostList.naver?blogId=relishsky&categoryName=CCM&categoryNo=50",
        type: "naver",
        enabled: true
    }
];
var USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
function decodeHtml(text) {
    return text
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
}
function stripTag(text) {
    return decodeHtml(text.replace(/<[^>]*>/g, "")).trim();
}
function normalizeForMatch(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\uac00-\ud7a3]+/gi, "")
        .trim();
}
function classifyMatch(title, query) {
    var normalizedTitle = normalizeForMatch(title);
    var normalizedQuery = normalizeForMatch(query);
    if (normalizedQuery && normalizedTitle.includes(normalizedQuery)) {
        return "exact";
    }
    return "similar";
}
function relevanceScore(title, query) {
    var loweredTitle = title.toLowerCase();
    var loweredQuery = query.toLowerCase();
    if (loweredTitle === loweredQuery) {
        return 120;
    }
    if (loweredTitle.includes(loweredQuery)) {
        return 90;
    }
    var words = loweredQuery.split(/\s+/).filter(Boolean);
    var score = 0;
    for (var _i = 0, words_1 = words; _i < words_1.length; _i++) {
        var word = words_1[_i];
        if (loweredTitle.includes(word)) {
            score += 24;
        }
    }
    return score;
}
function getRootUrl(url) {
    try {
        var parsed = new URL(url);
        return "".concat(parsed.protocol, "//").concat(parsed.host);
    }
    catch (_a) {
        return url;
    }
}
function fetchText(url) {
    return __awaiter(this, void 0, void 0, function () {
        var controller, timeout, response, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    controller = new AbortController();
                    timeout = setTimeout(function () { return controller.abort(); }, 8000);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, fetch(url, {
                            signal: controller.signal,
                            headers: { "User-Agent": USER_AGENT }
                        })];
                case 2:
                    response = _b.sent();
                    if (!response.ok) {
                        return [2 /*return*/, ""];
                    }
                    return [4 /*yield*/, response.text()];
                case 3: return [2 /*return*/, _b.sent()];
                case 4:
                    _a = _b.sent();
                    return [2 /*return*/, ""];
                case 5:
                    clearTimeout(timeout);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function fetchJson(url, headers) {
    return __awaiter(this, void 0, void 0, function () {
        var controller, timeout, response, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    controller = new AbortController();
                    timeout = setTimeout(function () { return controller.abort(); }, 10000);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, fetch(url, {
                            signal: controller.signal,
                            headers: __assign({ "User-Agent": USER_AGENT }, (headers !== null && headers !== void 0 ? headers : {}))
                        })];
                case 2:
                    response = _b.sent();
                    if (!response.ok) {
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, response.json()];
                case 3: return [2 /*return*/, (_b.sent())];
                case 4:
                    _a = _b.sent();
                    return [2 /*return*/, null];
                case 5:
                    clearTimeout(timeout);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function parseTistoryRss(xml, source, query) {
    var _a, _b, _c, _d, _e, _f, _g;
    var items = [];
    var blocks = (_a = xml.match(/<item>[\s\S]*?<\/item>/g)) !== null && _a !== void 0 ? _a : [];
    for (var _i = 0, blocks_1 = blocks; _i < blocks_1.length; _i++) {
        var block = blocks_1[_i];
        var title = stripTag(((_c = (_b = block.match(/<title>([\s\S]*?)<\/title>/i)) === null || _b === void 0 ? void 0 : _b[1]) !== null && _c !== void 0 ? _c : "").trim());
        var link = ((_e = (_d = block.match(/<link>([\s\S]*?)<\/link>/i)) === null || _d === void 0 ? void 0 : _d[1]) !== null && _e !== void 0 ? _e : "").trim();
        var pubDate = ((_g = (_f = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/i)) === null || _f === void 0 ? void 0 : _f[1]) !== null && _g !== void 0 ? _g : "").trim();
        var score = relevanceScore(title, query);
        if (!title || !link || score <= 0) {
            continue;
        }
        items.push({
            title: title,
            url: link,
            key: extractKeyFromTitle(title),
            source: source.name,
            publishedAt: pubDate,
            score: score,
            matchType: classifyMatch(title, query)
        });
    }
    return items;
}
function parseTistoryHtml(html, source, query) {
    var _a, _b, _c, _d, _e;
    var items = [];
    var matches = (_a = html.match(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)) !== null && _a !== void 0 ? _a : [];
    var root = getRootUrl(source.url);
    for (var _i = 0, matches_1 = matches; _i < matches_1.length; _i++) {
        var block = matches_1[_i];
        var href = (_c = (_b = block.match(/href="([^"]+)"/i)) === null || _b === void 0 ? void 0 : _b[1]) === null || _c === void 0 ? void 0 : _c.trim();
        var title = stripTag((_e = (_d = block.match(/>([\s\S]*?)<\/a>/i)) === null || _d === void 0 ? void 0 : _d[1]) !== null && _e !== void 0 ? _e : "");
        if (!href || !title || title.length < 2) {
            continue;
        }
        var score = relevanceScore(title, query);
        if (score <= 0) {
            continue;
        }
        var url = href.startsWith("http") ? href : "".concat(root).concat(href.startsWith("/") ? "" : "/").concat(href);
        items.push({
            title: title,
            url: url,
            key: extractKeyFromTitle(title),
            source: source.name,
            score: score,
            matchType: classifyMatch(title, query)
        });
    }
    return items;
}
function collectFromTistory(source, query) {
    return __awaiter(this, void 0, void 0, function () {
        var root, rss, parsed, html;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    root = getRootUrl(source.url);
                    return [4 /*yield*/, fetchText("".concat(root, "/rss"))];
                case 1:
                    rss = _a.sent();
                    if (rss) {
                        parsed = parseTistoryRss(rss, source, query);
                        if (parsed.length > 0) {
                            return [2 /*return*/, parsed];
                        }
                    }
                    return [4 /*yield*/, fetchText(source.url)];
                case 2:
                    html = _a.sent();
                    return [2 /*return*/, html ? parseTistoryHtml(html, source, query) : []];
            }
        });
    });
}
function searchNaverApi(query) {
    return __awaiter(this, void 0, void 0, function () {
        var clientId, clientSecret, endpoint, response;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    clientId = process.env.NAVER_CLIENT_ID;
                    clientSecret = process.env.NAVER_CLIENT_SECRET;
                    if (!clientId || !clientSecret) {
                        return [2 /*return*/, []];
                    }
                    endpoint = "https://openapi.naver.com/v1/search/blog.json" +
                        "?query=".concat(encodeURIComponent("".concat(query, " \uC545\uBCF4"))) +
                        "&display=30&sort=sim";
                    return [4 /*yield*/, fetchJson(endpoint, {
                            "X-Naver-Client-Id": clientId,
                            "X-Naver-Client-Secret": clientSecret
                        })];
                case 1:
                    response = _b.sent();
                    if (!((_a = response === null || response === void 0 ? void 0 : response.items) === null || _a === void 0 ? void 0 : _a.length)) {
                        return [2 /*return*/, []];
                    }
                    return [2 /*return*/, response.items
                            .filter(function (item) { return item.title && item.link; })
                            .map(function (item) {
                            var _a, _b, _c, _d;
                            var title = stripTag((_a = item.title) !== null && _a !== void 0 ? _a : "");
                            var link = decodeHtml((_b = item.link) !== null && _b !== void 0 ? _b : "");
                            var snippet = stripTag((_c = item.description) !== null && _c !== void 0 ? _c : "");
                            return {
                                title: title,
                                url: link,
                                key: extractKeyFromTitle(title),
                                source: item.bloggername ? "Naver:".concat(item.bloggername) : "Naver Search",
                                score: Math.max(relevanceScore("".concat(title, " ").concat(snippet), query), 28),
                                publishedAt: (_d = item.postdate) !== null && _d !== void 0 ? _d : "",
                                matchType: classifyMatch(title, query)
                            };
                        })];
            }
        });
    });
}
function dedupe(items) {
    var map = new Map();
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var item = items_1[_i];
        var key = item.url || item.title;
        var existing = map.get(key);
        if (!existing || item.score > existing.score) {
            map.set(key, item);
        }
    }
    return Array.from(map.values());
}
export function runSearch(query, sources) {
    return __awaiter(this, void 0, void 0, function () {
        var targetSources, tistorySources, _a, tistoryResults, naverApiResults, merged;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    targetSources = (sources && sources.length > 0 ? sources : defaultSources).filter(function (source) { return source.enabled; });
                    tistorySources = targetSources.filter(function (source) { return source.type === "tistory"; });
                    return [4 /*yield*/, Promise.all([
                            Promise.allSettled(tistorySources.map(function (source) { return collectFromTistory(source, query); })).then(function (settled) {
                                return settled.flatMap(function (result) { return (result.status === "fulfilled" ? result.value : []); });
                            }),
                            searchNaverApi(query)
                        ])];
                case 1:
                    _a = _b.sent(), tistoryResults = _a[0], naverApiResults = _a[1];
                    merged = dedupe(__spreadArray(__spreadArray([], tistoryResults, true), naverApiResults, true));
                    return [2 /*return*/, merged
                            .sort(function (a, b) {
                            if (b.score !== a.score) {
                                return b.score - a.score;
                            }
                            if (a.publishedAt && b.publishedAt) {
                                return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
                            }
                            return 0;
                        })
                            .slice(0, 150)];
            }
        });
    });
}
