/**
 * 곡 묶음 · 계절 업적이 보는 곡 — 곡은 공식 곡 번호(`Music.index`)로 고정한다. 제목은 같은 곡이 둘인 경우가 있고
 * (「トルコ行進曲」 모차르트 · 베토벤) 작곡가 표기도 곡마다 달라서다. 새 곡이 들어와도 묶음은 저절로 바뀌지 않는다.
 * 묶음 안 곡 중 S 이상(아무 난이도, `difficulty` 가 있으면 그 난이도만)을 받은 곡 수로 판정한다.
 */
export interface AchievementSongSet {
    category: "songSet" | "season";
    difficulty?: "Normal" | "Expert";
    /** 곡의 채보 모두가 기준을 넘어야 그 곡을 센다(「모든 난이도」 업적) */
    everyChart?: boolean;
    /** 곡을 세는 기준 — 없으면 S 이상 */
    lamp?: "fullCombo";
    songs: readonly string[];
}

export const ACHIEVEMENT_SONG_SETS = {
    chopin: {
        category: "songSet",
        songs: [
            "0f37f6dde98245e257fcaf99f7a4bc37", // 24の前奏曲より｢雨だれ｣
            "615b3a58b0d87d109301cc5d7942ab5e", // エチュード Op.10-1
            "ed2cd99edd8ce654f71289c422dbc76a", // エチュード Op.10-2
            "ac823f67f14b42e0502df498571ce5bf", // エチュード Op.10-4
            "61fd9b0ea895d980c1560ceb1852510e", // エチュード Op.10-5 「黒鍵」
            "7330802678f02674051a26ed54b0f88f", // エチュード Op.25-5
            "fb29f3c6ff1a5a70e355475af15d08c5", // スケルツォ第2番 Op.31
            "eef09be980dc31f69bd8d15a32b98948", // バラード第1番
            "ebe323d80c5b811461009a9f9740f02b", // ピアノソナタ第2番「葬送」第2楽章
            "bd8a09b514519664420ca5e4c023e5e2", // ピアノ協奏曲第1番第1楽章
            "fad373bdabd2641a3be890291c7d4b5e", // ワルツ第14番
            "6355769dae0aea3505f5b0473a417b1d", // 別れのワルツ
            "487d4940eda1189b86cdf19c1c91f2a9", // 別れの曲
            "9798e19b6ebaab863a931f5bed39aac6", // 夜想曲（ノクターン）第２番
            "0ff2ac56c4fd26219090d5b5cfcad29c", // 小犬のワルツ
            "811d0b8a9796791ef8fd9c4430f601eb", // 幻想即興曲
            "bd3c11e8b94e5a93680787bfedaaccdd", // 木枯らしのエチュード
            "2dd7cc6161556e1d900f8c358283335f", // 猫のワルツ
            "270a8e94a488622180c510c553a4e174", // 英雄ポロネーズ
            "d3762b5a1bcdb59f5c45860c2ac70dd1", // 華麗なる大円舞曲
            "77dfd5206e4c0b90883ed869ad838ad4", // 革命
        ],
    },
    beethoven: {
        category: "songSet",
        songs: [
            "b4f3a6f587d56706c40a353a470eb2f7", // 「6つのメヌエット」より第2番ト長調
            "2f3324b29853c1ffbcb677fdcf6760ec", // エリーゼのために
            "f8c718cb0ea2dcf7461ea5c7cc96f7da", // ソナチネ ト長調 第1楽章
            "60c606f860d9ec9caa2cb058776d9f86", // トルコ行進曲
            "b80e19e7a9c9d333ffe1b451d1994f5c", // ピアノソナタ「テンペスト」第３楽章
            "b82153d7f231a0ef7144b1e22c8eaf3f", // ピアノソナタ「ヴァルトシュタイン」第１楽章
            "42109914f36dd646468ec9bf521eee7e", // ピアノソナタ「悲愴」第２楽章
            "03d0c74c8e58cffd90e882570d7dffe8", // ピアノソナタ「月光」第１楽章
            "e941ceb700b8a404311dfa7b55f1271e", // ピアノソナタ「月光」第３楽章
            "337fd6d682e629f3aee7e965214220ec", // ピアノソナタ「熱情」第３楽章
            "44bdb026a87da1995b6dc09897e83e25", // ヴァイオリンソナタ第5番「春」第1楽章
            "6a95ceea9a19310ed4cb2bcf2e97a707", // 交響曲第5番第1楽章"運命"
            "2a3870dc4dc90348fac2619b5faede65", // 交響曲第7番第1楽章
            "73341c86824c1e41d4dcc7862a8959ce", // 交響曲第9番第4楽章"歓喜の歌"
        ],
    },
    bach: {
        category: "songSet",
        songs: [
            "2f58ac9d471d9dbb9b4904192827c16f", // アヴェ・マリア
            "e84fed7ebe0f94c3ca56c26b0f1b0d2d", // インベンション第13番
            "96a0ddf835b06309167075d1711ad810", // インベンション第1番
            "4d6f40e757a69b1bb998cc799ed35b26", // インベンション第4番
            "44ba70d2d93a96d08eff922aa22e28ed", // トッカータとフーガ ニ短調
            "3c7da67e3560df7b66f8318553cbb697", // 主よ、人の望みの喜びよ
            "d46c4f0752473042ffbbd63329c4c512", // 小フーガ ト短調 BWV578
            "84fc6d675822b54cb95bcaa237c09a97", // 平均律クラヴィーア曲集第1巻第2番プレリュード
            "f26155f80c318a0165daae5742c2a79e", // 管弦楽組曲第2番より「バディヌリー」
        ],
    },
    mozart: {
        category: "songSet",
        songs: [
            "357dd3899a51280a569ada66fe373f7a", // きらきら星変奏曲
            "15d4eb0c15adf2ca545e891c38882274", // アイネ・クライネ・ナハトムジク第1楽章
            "50f4f382a533e9afb6a30ab25a5b1079", // トルコ行進曲
            "ada5dd0625b0d337a4e7b1bb2a89d8cc", // ピアノソナタ第15番第1楽章
            "1be97d7c920d165097673eb6a29af576", // フィガロの結婚序曲
            "76303d0ef6dbb8ce00a2c218385802a0", // レクイエムより「怒りの日」
            "232372eb4dfbf09f8152fcfa0e45ec25", // 魔笛より夜の女王のアリア
        ],
    },
    rachmaninoff: {
        category: "songSet",
        songs: [
            "cdb8b07074085f016f807e923219f746", // イタリア風ポルカ
            "548a12c3ab2fac8bb336e7cf2ae902d6", // ピアノ協奏曲第2番第1楽章
            "d6e4abeeac7873e8dfd22f5dd56b1486", // ヴォカリーズ
            "efea9ad519d361d86ed17de868743ac7", // 前奏曲 Op.23-5
            "a09b043f50573bc7a8f67557858fd0ad", // 前奏曲 Op.23-9
            "19a325778e743c140372d0ec500b73e2", // 前奏曲 Op.3-2 「鐘」
            "5df2cfcab5ca8e7c80bacd75861e703e", // 絵画的練習曲「音の絵」第6曲「赤ずきんと狼」
        ],
    },
    impressionism: {
        category: "songSet",
        songs: [
            "12f85b1ff3afd7266fa3448d640f37ba", // Je te veux
            "ae4b6ce28e84f02e0316a5b4b2f4b3da", // アラベスク第1番
            "3b23e0c944ff49dd3192a92c1eb386a7", // クープランの墓よりプレリュード
            "436cef00c92887bc1d6ac798bd3ba064", // ゴリウォーグのケークウォーク
            "a00357304e68d6fb4b8a68515f6fbad5", // ジムノペディ第1番
            "df1e67dcf9581d6ea9096ede797bc80f", // ハイドンの名によるメヌエット
            "3a7b4db81dd56ed12c35d9313af8b435", // ボロディン風に
            "fd3d56024fc59c95eea681a9aa7e0878", // 亜麻色の髪の乙女
            "0c470a50bd1f64775dc140edc2fa877e", // 亡き王女のためのパヴァーヌ
            "59011cc8cda26e0a183908c1ab944240", // 古風なメヌエット
            "7ca171f31a22fbc4f9658828de89f580", // 夢想
            "def939ff5c7c67a0c324cd80f7dfad14", // 官僚的なソナチネより第１楽章・第３楽章
            "f616cacdc12ee69db5527d1605e8112d", // 月の光
            "8b4d22d04bc822d8ec02d1106b720a30", // 水の戯れ
        ],
    },
    nutcracker: {
        category: "songSet",
        songs: [
            "8c5a72178484de56cce1fd1997f6b937", // くるみ割り人形よりトレパック
            "d0f4808558c4f36fce4a0576b4c82ea0", // くるみ割り人形より小序曲
            "d16f791d852e05eec0908d276816d6cf", // くるみ割り人形より行進曲
            "31e9527c90c75c6d6d22c5787ccf5a87", // くるみ割り人形より金平糖の踊り
            "7d31ad0c5cef35db8ae82010701b5b74", // くるみ割り人形より花のワルツ
        ],
    },
    "piano-school": {
        category: "songSet",
        songs: [
            "6074dc5ad5cb15acb8d0d9741c07b9dc", // すなおな心
            "c3c666ee312e76a8abbefbc25ca15b9a", // アラベスク
            "970cb71e4ac4cea3ce42f551170bde0e", // 貴婦人の乗馬
            "9455f31f12fd6c6053cdaa16434ff181", // ソナチネ Op.20－1
            "51c60f05332510d1c408e5b1311cbe70", // ソナチネ Op.36－1
            "f8c718cb0ea2dcf7461ea5c7cc96f7da", // ソナチネ ト長調 第1楽章
            "96a0ddf835b06309167075d1711ad810", // インベンション第1番
            "4d6f40e757a69b1bb998cc799ed35b26", // インベンション第4番
            "e84fed7ebe0f94c3ca56c26b0f1b0d2d", // インベンション第13番
            "92c49d25fdc2bf6cb11346e283174136", // メヌエット イ短調
            "1416d114ec09443d8f5b15d02788d108", // メヌエット
            "3fdcca1235833cde7c92334627a57c40", // メヌエット ト短調
            "2f3324b29853c1ffbcb677fdcf6760ec", // エリーゼのために
            "dd4d80a2466a1079d30c0bb6e816af4d", // 乙女の祈り
        ],
    },
    "four-seasons": {
        category: "season",
        songs: [
            "eaa4047ce17fb873b19b42454b0f6f3b", // 協奏曲第1番ホ長調 RV 269「春」より第一楽章
            "fadd4ef8d25268d9299bfe5e83ed4ff7", // 協奏曲第2番ト短調 RV 315「夏」より第三楽章
            "83f92a3e2fddb60f64d1da42a04d60d1", // 協奏曲第3番ヘ長調 RV 293「秋」より第一楽章
            "bdc34b24457e0365978cf302953769d8", // 協奏曲第4番ヘ短調 RV 297「冬」より第一楽章
        ],
    },
    spring: {
        category: "season",
        songs: [
            "42cf17ae6126cc793ddecfac176b77a3", // printemps
            "b866c7b644a7598c425996fdc94c7077", // Sakura Sunrise
            "cd4d316f5f01e1d577e663207f975eba", // 春の歌
            "eaa4047ce17fb873b19b42454b0f6f3b", // 協奏曲第1番ホ長調 RV 269「春」より第一楽章
            "44bdb026a87da1995b6dc09897e83e25", // ヴァイオリンソナタ第5番「春」第1楽章
            "2f733689ec21214d6180888fe0e6b42f", // 50th Memorial Songs -二人の時 ～under the cherry blossoms～-
            "1dfac8a7a18283651af981ff0f6a3b81", // 千本桜
        ],
    },
    summer: {
        category: "season",
        songs: [
            "6e389e6c3ff7fa070b93769ba7298d1c", // MAGICAL SUMMER SMILE
            "f90fbf7348c061ffa52f233435438d91", // SUPER SUMMER SALE
            "f4a20d356373cb6cee2cc8e240aad865", // Good bye, Summer～さよならは言わない～
            "6070118836dd54d1baaf86f1db27c066", // なつやすみのぼうけん
            "361d190b8071ed94c0dc958f960c1b55", // 夏色DIARY 夕凪ノスタルジア
            "5901c3ede8ab1e55e5b49f7109f0a5cb", // 隅田川夏恋歌
            "b6fc24fcf90c3de426b3f503ccb03d36", // 風鈴花火
            "87d394c8b3ba64b388148da4b436a946", // 恋愛観測 -2021真夏のエンディング ver.-
            "fadd4ef8d25268d9299bfe5e83ed4ff7", // 協奏曲第2番ト短調 RV 315「夏」より第三楽章
        ],
    },
    autumn: {
        category: "season",
        songs: [
            "246556edd71c08fdefc0eebc396bfaa7", // Afterimage d'automne
            "93a7b19100125ed956d53efcd9f95aaa", // fallen leaves
            "870f86b88ba0ad34087c7fc1de0604a1", // KOUYOU
            "bd3c11e8b94e5a93680787bfedaaccdd", // 木枯らしのエチュード
            "83f92a3e2fddb60f64d1da42a04d60d1", // 協奏曲第3番ヘ長調 RV 293「秋」より第一楽章
        ],
    },
    winter: {
        category: "season",
        songs: [
            "f1f0106128e60aef9c0377a021b3b79b", // Holy Snow
            "52f6141b46fe202e4efb5bf7d92c2338", // WHITEOUT
            "692634d6616a940cb4867cd89c2b1fd1", // Missing in the snow
            "a000cef38325edfe4f7276842915a57c", // My Little Snowman
            "5254f15d6164980da29ef1e393790579", // 氷上の激情
            "f789d26a901ed5573a1c13ae715e4238", // 蒼氷のフラグメント
            "dca619ee892d79b5a6c25e8749573d94", // Frozen Ray -nostal mix-
            "64a470d4b4d35668e2fcd80ef1be02c1", // 樅の木
            "bdc34b24457e0365978cf302953769d8", // 協奏曲第4番ヘ短調 RV 297「冬」より第一楽章
        ],
    },
    christmas: {
        category: "season",
        songs: [
            "f1f0106128e60aef9c0377a021b3b79b", // Holy Snow
            "a000cef38325edfe4f7276842915a57c", // My Little Snowman
            "64a470d4b4d35668e2fcd80ef1be02c1", // 樅の木
            "fe384bfb0619fd76899c29fe895f2fdd", // ニコラウスさんの出来心
            "bdf15f826a5eee3626ea3fd8814ff4de", // Ha・lle・lu・jah
            "8c5a72178484de56cce1fd1997f6b937", // くるみ割り人形よりトレパック
            "d0f4808558c4f36fce4a0576b4c82ea0", // くるみ割り人形より小序曲
            "d16f791d852e05eec0908d276816d6cf", // くるみ割り人形より行進曲
            "31e9527c90c75c6d6d22c5787ccf5a87", // くるみ割り人形より金平糖の踊り
            "7d31ad0c5cef35db8ae82010701b5b74", // くるみ割り人形より花のワルツ
        ],
    },
    halloween: {
        category: "season",
        songs: [
            "700892aa1b7a6ee13456fd010c1892c4", // 交響詩「死の舞踏」
            "da9e2d67353e6a0d4e443a9d9d2e43e6", // 交響詩「はげ山の一夜」
            "be03c65ed737a7805dde4d1deb53474e", // 魔王
            "36e81658370f16786fae59c65e5fb118", // 山の魔王の宮殿にて
            "beb73e6729a9b8febdd520c42558dabf", // 幻想交響曲第4楽章「断頭台への行進」
            "76303d0ef6dbb8ce00a2c218385802a0", // レクイエムより「怒りの日」
            "e86d2f44a9d5128055aed9a9a60f60ca", // 交響詩 「魔女狩り」
            "a77f683dceb3449f04c549e6e1f9801a", // 交響詩「悪魔の誕生」
            "36f16c256067e7a6f8ae8235ed2428ba", // LIKE A VAMPIRE
        ],
    },
    "nostalgia-trilogy": {
        category: "songSet",
        songs: [
            "bce23f9d40ceb94747ca7384286c0419", // Vide Nostalgia
            "fe6f22d48445557b0e704c047d418b89", // Voca Nostalgia
            "2410255c29b715a602ed120c84be9c0a", // Audite Nostalgia
        ],
    },
    nostos: {
        category: "songSet",
        songs: [
            "fc143d20e26e990eae4cdab357bb4836", // nostos
            "aa04c4e5a4c65a6328d96dc76f856ef8", // nostos algos
        ],
    },
    finale: {
        category: "songSet",
        songs: [
            "74b47a9327a59225181917c41044d835", // 終曲「黒の狂」
            "86a9dd343c91714996d566c2e31ec482", // 終曲・改「三儀の凱奏」
        ],
    },
    "hard-normal": {
        category: "songSet",
        difficulty: "Normal",
        songs: [
            "9aa62c3e810f1f7781cafd151e8c0439", // ピアノ独奏無言歌 "灰燼"
            "001d90752256720f9c6119f3d47c9c01", // 女神の微睡
            "7b20714052e9aec51a0c8320119b0c0b", // 天使の追放
            "a77f683dceb3449f04c549e6e1f9801a", // 交響詩「悪魔の誕生」
        ],
    },
    sakuzyo: {
        category: "songSet",
        songs: [
            "59d7b7a3714e108fd09e98971aa90161", // Altale
            "7eb92db4faebba4c80920b9cb27d9b63", // Le Vent
            "c6ba32fd3514d28221f65a90c6423312", // Sweet tea
            "e86d2f44a9d5128055aed9a9a60f60ca", // 交響詩 「魔女狩り」
            "a77f683dceb3449f04c549e6e1f9801a", // 交響詩「悪魔の誕生」
            "d809d024162fab676360194000c03850", // 追憶の変奏曲
        ],
    },
    "waltz-dogs-cat": {
        category: "songSet",
        songs: [
            "0ff2ac56c4fd26219090d5b5cfcad29c", // 小犬のワルツ
            "dbce4a7b77cb2f0a80a431164bdb6584", // ワルツ第17番 ト短調”大犬のワルツ”
            "2dd7cc6161556e1d900f8c358283335f", // 猫のワルツ
        ],
    },
    "turkish-march": {
        category: "songSet",
        songs: [
            "50f4f382a533e9afb6a30ab25a5b1079", // トルコ行進曲
            "60c606f860d9ec9caa2cb058776d9f86", // トルコ行進曲
        ],
    },
    flower: {
        category: "songSet",
        songs: [
            "934dc6f7e3c4ea4998876a0f9b5ae886", // FLOWER ～live pf addition～
            "9809063c879d432f7383a2c197887b79", // FLOWER (BEMANI SYMPHONY NOSTALGIA mix)
        ],
    },
    mei: {
        category: "songSet",
        songs: [
            "73b5511d0d2406cd5d2cc9abba8d5ec0", // 冥 (BEMANI SYMPHONY NOSTALGIA mix)
        ],
    },
    sasoribi: {
        category: "songSet",
        songs: [
            "818b48940c2d17325904fbab68689046", // ピアノ協奏曲第1番“蠍火”
            "9aa62c3e810f1f7781cafd151e8c0439", // ピアノ独奏無言歌 "灰燼"
        ],
    },
    "bemani-symphony": {
        category: "songSet",
        songs: [
            "ee55a356070d72f8768d1520db29b053", // Colorful Cookie (BEMANI SYMPHONY NOSTALGIA mix)
            "12ca5c5c87e6bcc03a8a604d1bee86b5", // Element of SPADA (BEMANI SYMPHONY NOSTALGIA mix)
            "afa94c162a18ea16a3c8afb6b97954d5", // Everlasting Message (BEMANI SYMPHONY NOSTALGIA mix)
            "9809063c879d432f7383a2c197887b79", // FLOWER (BEMANI SYMPHONY NOSTALGIA mix)
            "061bc53b2c02d9555a4cfad5b1bf4215", // JOMANDA (BEMANI SYMPHONY NOSTALGIA mix)
            "a5d9b869e6a3e284be40cdf982ba262a", // Lachryma《Re:Queen’M》 (BEMANI SYMPHONY NOSTALGIA mix)
            "aaf626d7ae02580291e094109a1ac749", // Lisa-RICCIA (BEMANI SYMPHONY NOSTALGIA mix)
            "72ab56d46f34784f2f6ce06908ad3cdb", // VALLIS-NERIA (BEMANI SYMPHONY NOSTALGIA mix)
            "a4bf36b15f1291ceb0acf27f8632e25e", // perditus†paradisus (BEMANI SYMPHONY NOSTALGIA mix)
            "f8c38a82a336fc25291c7e6f9d4de932", // smooooch・∀・ (BEMANI SYMPHONY NOSTALGIA mix)
            "53b536d338b7137d0acb107d5d7708cd", // starmine (BEMANI SYMPHONY NOSTALGIA mix)
            "69d0f6276e3eccd544916c51ebc691b6", // さよなら世界 (BEMANI SYMPHONY Arr.)
            "1c025feb4eb01299f7da44752c70391a", // リメンバーリメンバー (BEMANI SYMPHONY Arr.)
            "73b5511d0d2406cd5d2cc9abba8d5ec0", // 冥 (BEMANI SYMPHONY NOSTALGIA mix)
            "3fa3f076007d56edb056f44dcb7d83e5", // 嘆きの樹 (BEMANI SYMPHONY NOSTALGIA mix)
            "1d10a376c419709b18e34c16dda7d1e2", // 天空の夜明け (BEMANI SYMPHONY NOSTALGIA mix)
            "34c98466195daf01349a55f807df5a95", // 流砂の嵐 (BEMANI SYMPHONY Arr.)
            "d5ee7f9de32fd7c15b91d10fef66f37b", // 海神 (BEMANI SYMPHONY Arr.)
            "e04f13aa6dc4e0abbfe3122f50594d0c", // 量子の海のリントヴルム (BEMANI SYMPHONY NOSTALGIA mix)
        ],
    },
    "memorial-50th": {
        category: "songSet",
        songs: [
            "dbf06e9de40f7ac146d2bdaebb86f0db", // 50th Memorial Songs -Beginning Story-
            "870d42a1748138d78cdb4b28f73197b8", // 50th Memorial Songs -Flagship medley-
            "77dbd8e9c3c0afe15990fccdf7170c86", // 50th Memorial Songs -The BEMANI History-
            "2f733689ec21214d6180888fe0e6b42f", // 50th Memorial Songs -二人の時 ～under the cherry blossoms～-
        ],
    },
    undertale: {
        category: "songSet",
        songs: [
            "5ab4f416b44f66844ad70f608f955af8", // Once Upon a Time / むかしむかし…
            "01dabfff5f563f6339b60338fc44b903", // Bonetrousle
            "39cf43e73c9dace2fe6738e350717e56", // MEGALOVANIA
            "e171945dd4afc3c77e76517e228cb135", // Battle Against a True Hero / 本物のヒーローとの戦い
            "8a4e04386dbe30c1739d6ca316b09829", // Hopes and Dreams / 夢と希望
        ],
    },
    touhou: {
        category: "songSet",
        songs: [
            "0665df5ef855795655cf5fc94ee7b053", // U.N.オーエンは彼女なのか？
            "34a6a18ffd41f7ea619c3968831240b6", // 幽雅に咲かせ、墨染の桜 ～ Border of Life
            "17bba0319c67ee802e25feebd7c3526e", // Bad Apple!! feat. nomico
            "49fcdb015cf32f183c6c09a4eeda7f1c", // 亡き王女の為のセプテット
            "21064019f1794507559b85113b832bc1", // ナイト・オブ・ナイツ
            "89041a876c02de8760071db015b239c4", // 神々が恋した幻想郷
            "412d3d6b2ae4c7fefa8d0cf8c5beef0b", // 月に叢雲華に風
            "060cede4c6584bcd02c868af1d2b1f7b", // 幻想のサテライト
            "e18d0965f45c739477aabdddaa9463d1", // 待チ人ハ来ズ。
            "ff2395b155d5ae6d8ca82fb75c33ab17", // 向日葵サンセット
            "2edfbc621029b3366a3847b70723d752", // 妖隠し -あやかしかくし-
        ],
    },
    hinabita: {
        category: "songSet",
        songs: [
            "d3d17e66d4f7dd7026d8e02bcd09a630", // 3 A.M. ディテクティブ・ゲーム
            "a14a3ce02bfad9a67927905932802d75", // neko*neko
            "c4268d60504c740613d3d8e33c9ee38c", // ちくわパフェだよ☆CKP
            "3c505ec205f031cfde6187661b42e136", // ぽかぽかレトロード～Home Sweet Home edition～
            "4dd54e75922c1304185de43cd40dcaef", // めうめうぺったんたん！！
            "947e9965c1db88a7002b2808fff1b587", // イブの時代っ！
            "7ac09be506f1b321ddacd09e621fef71", // イマココ！この瞬間
            "70ea28918360ad3624934066076a26c7", // チョコレートスマイル
            "89928ca68155a8983ce45c419acb71db", // 乙女繚乱 舞い咲き誇れ
            "8ad61202d4da074e7c0a88b217735bad", // 凛として咲く花の如く ～ひなビタ♪ edition～
            "b7164e4b91c568e4f6a0695b1e339608", // 恋とキングコング
            "af1e200a0695eae9792c589f6725725d", // 滅びに至るエランプシス
            "bad1eec24fff41f5fd70b5ebaa00587a", // 琥珀のくちづけ ～まり花＆一舞 duet edition～
            "2cba7dac1b1ac37e14525d4424663723", // 花のやくそく
            "79b474239beee28fdfa2e1781107d4ed", // 走れメロンパン
        ],
    },
    stars: {
        category: "songSet",
        songs: [
            "2d83800bcba7dbf887928e51ac2fa827", // COSMIC SYMPHONY
            "aac8ded91f4be6070c42a81c70d8a710", // Starlight Fantasia
            "d383b45b9a1a6ab5561834ed500db580", // Spica
            "c0ac13bc2018111e683acf198aa0e2c8", // Northern Cross
            "babd7870c564b05b44ede36ba4a8411b", // Vinculum stellarum
            "5e23d7eb192d18a0489b03b677c78bc3", // Votum Stellarum
            "dc9730ec9213082696afbc7df221f4fd", // Stella Sinistra
            "b6fcc47b1ce97606234397373c73f06b", // 星座が恋した瞬間を。
            "0e6271f639ad8969c57821b1b2764d59", // ポラリスノウタ
            "162589035b9b5e4b1779f7a2fa13961c", // The Dynamics of an Asteroid
            "53f6fec811d770cff9f0af293170e339", // 羊皮紙の上の銀河
            "da2d85e1bca2d200439921f61107aa70", // ロミとロボの宇宙飛行
            "73b96acaaba4c366d6d56b69de287a72", // 恋と赤方偏移
            "e56d61f70637bd15f1a48c9b9a082d99", // レグルス αβ
            "357dd3899a51280a569ada66fe373f7a", // きらきら星変奏曲
        ],
    },
    rain: {
        category: "songSet",
        songs: [
            "0f37f6dde98245e257fcaf99f7a4bc37", // 24の前奏曲より｢雨だれ｣
            "e8055614319e6aea8c25f325b2bfbffc", // 雫
            "737baed1347bbbf025bd32e3391af513", // 霖が哭く
            "1bc57abed4d73664f8cb68e0a1665ec0", // 天泣
            "a4ce59bc6a2dd2bb81a01a9d38082766", // ウソツキ横丁は雨模様
        ],
    },
    cats: {
        category: "songSet",
        songs: [
            "2dd7cc6161556e1d900f8c358283335f", // 猫のワルツ
            "f8ef7556dce32aa610d831f4b327daf2", // 猫侍の逆襲
            "9364dab730aada0cb675bd536d1a2f02", // シュレーディンガーの猫
            "a14a3ce02bfad9a67927905932802d75", // neko*neko
            "e72abcbcb9c08e5d330459adc0758cb5", // neko fun jitter
            "df511698288ba255f3089605a8b49c1b", // にゃんだふる55 marble version
            "40ae24ca91ac1c0e070b2e5dce7f3321", // 夕焼け猫とブリキのロボット
            "4e013b7544927849e1a4b990dd29673a", // とこにゃつ☆トロピカル
        ],
    },
    food: {
        category: "songSet",
        songs: [
            "79b474239beee28fdfa2e1781107d4ed", // 走れメロンパン
            "c4268d60504c740613d3d8e33c9ee38c", // ちくわパフェだよ☆CKP
            "2aa229c868846980975c47b2139a2b27", // ハラショー！おにぎりサーカス団☆
            "3553668b0a170536601d7511a0b2b1a1", // お米の美味しい炊き方、そしてお米を食べることによるその効果。
            "7a598f6801a80e8853f2c3cf924bd1a8", // Tapioca
            "c6ba32fd3514d28221f65a90c6423312", // Sweet tea
            "5a744e415e36c28037c3f423fb7ec0cd", // Tea for Two
            "26d03a7047403fad29f8af592ab0b126", // CHOCOLATE PHILOSOPHY
            "70ea28918360ad3624934066076a26c7", // チョコレートスマイル
            "31e9527c90c75c6d6d22c5787ccf5a87", // くるみ割り人形より金平糖の踊り
        ],
    },
    keyboard: {
        category: "songSet",
        songs: [
            "0ed5729e40e9f5517ec7e1be937f554b", // EBONY & IVORY
            "61fd9b0ea895d980c1560ceb1852510e", // エチュード Op.10-5 「黒鍵」
            "68007c8d68fbdba159124dc1606045a8", // 協奏曲「世界の果てに約束の凱歌を」～28の鍵盤のための～
            "d89fc256c59c636f3d551fa013768f5d", // 零と弌の鍵の唄
            "20ffd09cc0a40225a74447e807756116", // モノクロモーメント
        ],
    },
    "garbage-truck": {
        category: "songSet",
        songs: [
            "2f3324b29853c1ffbcb677fdcf6760ec", // エリーゼのために
            "dd4d80a2466a1079d30c0bb6e816af4d", // 乙女の祈り
            "dbaf8e326202f9c962a455ce7c19faa4", // 人形の夢と目覚め
        ],
    },
    "sports-day": {
        category: "songSet",
        songs: [
            "b45d155a7d3a5732f1a69f4dad0a02c9", // クシコス・ポスト
            "0b40c005ac6c517ddbbe0ff52c50e8bd", // ウィリアム・テル序曲
            "696504137e7e3006bb6aa18580d966e2", // ラデツキー行進曲
            "c7ff3303eb80b59445ca5e4ef4013573", // トリッチ・トラッチ・ポルカ
        ],
    },
    "cartoon-classics": {
        category: "songSet",
        songs: [
            "c88f3f90009f8ad88c2304d9a5cdb3fe", // ハンガリー狂詩曲第2番
            "0b40c005ac6c517ddbbe0ff52c50e8bd", // ウィリアム・テル序曲
            "cd4d316f5f01e1d577e663207f975eba", // 春の歌
            "c6b441ce60c6c9671ccfad5687d8a518", // ワルキューレの騎行
            "36e81658370f16786fae59c65e5fb118", // 山の魔王の宮殿にて
        ],
    },
    organ: {
        category: "songSet",
        songs: [
            "44ba70d2d93a96d08eff922aa22e28ed", // トッカータとフーガ ニ短調
            "d46c4f0752473042ffbbd63329c4c512", // 小フーガ ト短調 BWV578
        ],
    },
    "last-stop": {
        category: "songSet",
        songs: [
            "50f4f382a533e9afb6a30ab25a5b1079", // トルコ行進曲
            "15d4eb0c15adf2ca545e891c38882274", // アイネ・クライネ・ナハトムジク第1楽章
        ],
    },
    "fate-motif": {
        category: "songSet",
        songs: [
            "6a95ceea9a19310ed4cb2bcf2e97a707", // 交響曲第5番第1楽章"運命"
        ],
    },
    wedding: {
        category: "songSet",
        songs: [
            "2e59e73aa615ed5f3db0f612152c2231", // 結婚行進曲
            "3c7da67e3560df7b66f8318553cbb697", // 主よ、人の望みの喜びよ
            "2f58ac9d471d9dbb9b4904192827c16f", // アヴェ・マリア
            "fdeed4055452c67a7fefbbcab228bf62", // 愛の挨拶
        ],
    },
    megalovania: {
        category: "songSet",
        songs: [
            "39cf43e73c9dace2fe6738e350717e56", // MEGALOVANIA
        ],
    },
    "bad-apple": {
        category: "songSet",
        everyChart: true,
        songs: [
            "17bba0319c67ee802e25feebd7c3526e", // Bad Apple!! feat. nomico
        ],
    },
    "scarlet-sisters": {
        category: "songSet",
        songs: [
            "49fcdb015cf32f183c6c09a4eeda7f1c", // 亡き王女の為のセプテット
            "0665df5ef855795655cf5fc94ee7b053", // U.N.オーエンは彼女なのか？
        ],
    },
    marasy: {
        category: "songSet",
        songs: [
            "504cedf034dbc5d20562371ad36b72a2", // Evans
            "af604ac415232e33979cc1bade81762b", // Moonstone
            "c91b6a1d2d4e7d2f295e2400ca34ebb4", // アスノヨゾラ哨戒班
            "09b2f243c49bc3d92ca7a70a567cde9f", // ウミユリ海底譚
            "ffd59363a75f2c4e29821d7f59c090fd", // セツナトリップ
            "21064019f1794507559b85113b832bc1", // ナイト・オブ・ナイツ
            "684f2ad749aafaf23c813231322fff82", // ロストワンの号哭
            "f303d1cc6e9ec337ca5342190b4ecdfa", // 凛として咲く花の如く
            "1dfac8a7a18283651af981ff0f6a3b81", // 千本桜
            "a93ba9cc34b4ff9237a437c4fdb47960", // 夢ハ夢ノママデ
        ],
    },
    wakhmaninov: {
        category: "songSet",
        songs: [
            "818b48940c2d17325904fbab68689046", // ピアノ協奏曲第1番“蠍火”
            "9aa62c3e810f1f7781cafd151e8c0439", // ピアノ独奏無言歌 "灰燼"
            "dbce4a7b77cb2f0a80a431164bdb6584", // ワルツ第17番 ト短調”大犬のワルツ”
            "2317fc0e71d3f39c6346e15bb21d2fc1", // virkatoの主題によるperson09風超絶技巧変奏曲
        ],
    },
    "grand-slam": {
        category: "songSet",
        songs: [
            "f303d1cc6e9ec337ca5342190b4ecdfa", // 凛として咲く花の如く
            "8ad61202d4da074e7c0a88b217735bad", // 凛として咲く花の如く ～ひなビタ♪ edition～
        ],
    },
    "demon-kings": {
        category: "songSet",
        difficulty: "Expert",
        songs: [
            "be03c65ed737a7805dde4d1deb53474e", // 魔王
            "160889038ac8aa9936605e2bf8fbe300", // ambages
            "36e81658370f16786fae59c65e5fb118", // 山の魔王の宮殿にて
        ],
    },
    "piano-concertos": {
        category: "songSet",
        songs: [
            "bd8a09b514519664420ca5e4c023e5e2", // ピアノ協奏曲第1番第1楽章
            "548a12c3ab2fac8bb336e7cf2ae902d6", // ピアノ協奏曲第2番第1楽章
            "fafafc96f6a22ee35fbae8acb5319978", // ピアノ協奏曲第1楽章
            "818b48940c2d17325904fbab68689046", // ピアノ協奏曲第1番“蠍火”
        ],
    },
    erlkonig: {
        category: "songSet",
        everyChart: true,
        lamp: "fullCombo",
        songs: [
            "be03c65ed737a7805dde4d1deb53474e", // 魔王
        ],
    },
    bells: {
        category: "songSet",
        lamp: "fullCombo",
        songs: [
            "7f4d50f868741e26283e08b9b8d50699", // ラ・カンパネラ
            "19a325778e743c140372d0ec500b73e2", // 前奏曲 Op.3-2 「鐘」
        ],
    },
    "minute-waltz": {
        category: "songSet",
        songs: [
            "0ff2ac56c4fd26219090d5b5cfcad29c", // 小犬のワルツ
        ],
    },
    bumblebee: {
        category: "songSet",
        difficulty: "Expert",
        songs: [
            "26db1890305f125eeb0ab1dc5c8ac3b4", // 熊蜂の飛行
        ],
    },
} as const satisfies Record<string, AchievementSongSet>;

export type AchievementSongSetKey = keyof typeof ACHIEVEMENT_SONG_SETS;
