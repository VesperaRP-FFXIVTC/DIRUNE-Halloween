// =====================================================
// ⭐️ 紋章圖片對照表（魔書和惡魔懸賞共用這一份）
//
// 圖片放在下面 STAMP_FOLDER 指定的資料夾，這裡只要填「檔名」就好。
// 檔名要「完全一樣」，包括大小寫和副檔名（.png / .PNG / .jpg）。
// 留空的話，會自動找「編號.png」，例如 5.png
//
// 惡魔懸賞的剪影是程式自動把圖片塗黑產生的，不用另外做。
// （圖片需要是「透明背景」的 PNG，剪影才會是貓的形狀）
// =====================================================
const STAMP_FOLDER = 'image/stamp/';

const STAMP_FILES = {
    1:  '伊萊諾斯.png',
    2:  'Aly.png',
    3:  'Eating.png',
    4:  '洛摩.png',
    5:  '美華.png',     // 第一關
    7:  '斯咪.png',     // 第二關
    6:  '赤羽.png',     // 第三關
    8:  '終結.png',     // 第四關
    9:  '小丸.png',     // 第四關
    10: '甜甜圈.png',   // 第五關
    11: '貓糕.png',     // 第六關
    12: '維梧爾.png',   // 第七關
    13: '溫斯頓.png',   // 第七關
    14: '堡.png',       // 第八關
    15: '燎.png',       // ？？？
    16: '倒頭.png',     // 魔王城
    17: 'INU.png'       // 紅貓魔王
};

function stampImageUrl(n) {
    const file = STAMP_FILES[n] || (n + '.png');
    return STAMP_FOLDER + encodeURIComponent(file);
}

// 紋章名稱：直接用檔名（去掉副檔名），例如「美華.png」→「美華」
function stampName(n) {
    const file = STAMP_FILES[n];
    return file ? file.replace(/\.[^.]+$/, '') : '第 ' + n + ' 號';
}

// 紋章編號 → 關卡
function stampStage(n) {
    const map = { 5: '第一關', 6: '第二關', 7: '第三關', 8: '第四關', 9: '第四關', 10: '第五關',
                  11: '第六關', 12: '第七關', 13: '第七關', 14: '第八關', 15: '？？？',
                  16: '魔王城', 17: '魔王城' };
    return n <= 4 ? '第零關' : map[n];
}