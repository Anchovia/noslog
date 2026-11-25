# 리듬게임 FAST · SLOW(EARLY · LATE) 방향 색

2026-11-25 작성. 사용자 말: FAST · SLOW 는 리듬게임에서 대중적으로 쓰는 색을 쓰고 싶다. 앞 조사([차트 색 값](./2026-11-25-color-values-chart.md) C02 · C03)는 Kamaitachi 로그인 벽 때문에 리듬게임 판정 방향 색을 한 곳도 재지 못했다. 이번에는 게임 화면 · 공식 그림 · 오픈소스 색 정의 코드로 잰다.

잰 방법은 셋이다. 그림은 글자 채움 픽셀 여러 개의 최빈값 또는 상위 평균(JPEG 은 근삿값), 코드는 색 정의 줄, 소스 이미지는 원본 PNG 픽셀 최빈값. 추천 · 결정은 판([비교 판](#판))에서 한다. 캡처는 커밋하지 않고 공유 폴더 `fast-slow/caps/` 에 있다.

## 곳 수 요약

게임 14곳(게임 · 클라이언트 단위), 사이트 1곳. 목표 15곳에 게임 1곳 모자란다.

| 꼴                              | 게임                                                                                                                                                                            | 곳 수 | 비고                                                                       |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | -------------------------------------------------------------------------- |
| FAST 파랑 계통 · SLOW 빨강 계통 | IIDX · ONGEKI · maimai DX · CHUNITHM · beatoraja(스킨 4종 중 3종)                                                                                                               | 5     | maimai 는 소재 모음 그림 · CHUNITHM 은 어둡게 눌린 설명 그림이라 값은 약함 |
| 파랑 · 청록 계통 / 분홍 계통    | Muse Dash · Quaver · DDR WORLD(결과 화면)                                                                                                                                       | 3     | 근거 약함                                                                  |
| FAST 빨강 · SLOW 파랑(반대)     | SOUND VOLTEX                                                                                                                                                                    | 1     | 근거 약함 · 옵션으로 맞바꿈                                                |
| 마젠타 / 시안                   | unnamed-sdvx-clone(오픈소스 SDVX 클론)                                                                                                                                          | 1     | 근거 약함                                                                  |
| 방향 색 없음                    | osu!(lazer) · Etterna · Simply Love(ITGmania) · StepMania 5 · 사이트 Tachi                                                                                                      | 4 + 1 | 글자 흰색이거나 점 · 위치로 방향을 말함                                    |
| 못 잼                           | pop'n music · jubeat · NOSTALGIA · Taiko · DJMAX RESPECT V · Arcaea · Phigros · Project SEKAI · Rotaeno · Cytus II · Deemo II · Lanota · Rhythm Doctor · Clone Hero · Malody 등 | -     | 미확인                                                                     |

사이트(로그인 없이 보이는 쪽)는 Tachi 소스 1곳만 확인했고, 계산 스타일로 잰 사이트는 0곳이다. 이 점이 이번 조사의 한계다.

## 게임

### beatmania IIDX 30 RESIDENT

- 출처: https://iidx.org/beginner/ingame (`assets/img/resident/offset.jpg`, 640x360) · 2026-11-25
- FAST ~#5cc1f7 · SLOW ~#fa575e. 글자 채도 픽셀 104개 · 101개 중 상위 20개 평균(JPEG 근삿값).
- 계통 하늘 / 빨강 · 다크 화면. 캡처 `caps/iidx_offset.jpg`(직접 열어 FAST 하늘색 · SLOW 빨강 확인).
- 옵션 메뉴 이미지(`caps/iidx_fastslow.png`)에는 글자만 있어 세지 않음.

### ONGEKI

- 출처: https://ongeki.sega.jp/news/20200210/ 결과 화면 `img3.jpg`(700x278) · 2026-11-25
- FAST 글자 ~#49b0e3(숫자 ~#0390eb) · LATE 글자 ~#e1480c(숫자 ~#ed4148). 알약 바탕 #171715. 글자가 작아 픽셀 12~32개.
- 계통 파랑 / 주황빨강 · 다크. 캡처 `caps/ongeki-result-fast-late.jpg`(직접 확인).

### maimai DX

- 출처: Bilibili https://www.bilibili.com/opus/694985211225571337 맨 위 판정 글자 소재 모음 그림(1920x564) · 2026-11-25
- FAST 글자 #0555ca(같은 값 픽셀 2,549개) · LATE 글자 #d50d0d(2,724개). 같은 글 본문도 「Fast 파랑, Late 빨강」.
- 계통 파랑 / 빨강 · 밝은 바탕 소재 그림이라 다크 화면이 아니고 인게임 캡처가 아님. 인게임 스크린샷은 공식 お知らせ · gamerch 에서 못 찾음.
- 캡처 `caps/maimai-dx-judgement-assets.png`(직접 확인).

### CHUNITHM

- 출처: https://chunithm.sega.jp/play/option/ 「判定詳細表示」 그림 `photo18.png`(600x338) · 2026-11-25
- FAST 어둡게 눌린 #2c415a · #1e3b65 · LATE #5d3134 · #5c1a1d. 설명용으로 어둡게 깔린 상태라 켜진 색값은 미확인, 계통만 파랑 / 빨강.
- 캡처 `caps/chunithm-option-judge-display.png`.

### SOUND VOLTEX VI

- 출처: https://www.sdvx.org/en/startingout/options (`Earlyexample.webp` · `Earlylateflip.webp`) · 2026-11-25
- 옵션 「EARLY/LATE 표시색 반전」 메뉴 라벨 EARLY ~#cb0b0c · LATE ~#0d5acc(webp 손실). 게임 화면 EARLY 글자 ~#c7616c, LATE 는 이 이미지에 없음.
- 기본이 EARLY 빨강 · LATE 파랑이고 옵션이 맞바꾼다(sdvx.org 글). 즉 FAST(EARLY)가 빨강으로 IIDX 와 반대. 다크 화면.
- 캡처 `caps/sdvx_Earlylateflip.png`(직접 확인: EARLY 빨강 · LATE 파랑).

### DanceDanceRevolution WORLD

- 출처: https://p.eagate.573.jp/game/ddr/ddrworld/howto/how_graph.html (`how_graph05.jpg`, 600x338) · 2026-11-25
- 결과 화면 타이밍 그래프: FAST GREAT ~#34d5c6 · SLOW ~#fc53a4(SLOW GREAT ~#d85999 · SLOW MISS ~#c81c70). 계통 청록 / 분홍 · 다크.
- 게임 중 표시는 미확인(일본어 위키 검색 요약에 「FAST 파랑 · SLOW 빨강」이 있었으나 확인 못 해 값으로 안 씀).
- 캡처 `caps/ddrworld_graph05.jpg`(직접 확인: 범례 청록, 「SLOW -6.5 ms」 분홍).

### Muse Dash

- 출처: Steam 가이드 https://steamcommunity.com/sharedfiles/filedetails/?id=2813552671 인게임 「GREAT EARLY」 · 「PERFECT LATE」 · 2026-11-25
- EARLY ~#36c9fc(채도 높은 픽셀 3,422개) · LATE ~#ff009c(3,756개, 중앙값 #f20191). 계통 하늘 / 분홍 · 다크 화면. LATE 는 빨강이 아니라 분홍.
- 캡처 `caps/musedash-great-early.png`(직접 확인: EARLY 하늘색).

### beatoraja(스킨)

- 기본 스킨 https://github.com/exch-bms2/beatoraja/blob/master/skin/default/judgedetail.png EARLY #0000ff · LATE #ff0000(원본 PNG 불투명 픽셀 300 · 210개 최빈값). 캡처 `caps/beatoraja_judgedetail.png`(직접 확인).
- GenericTheme `play/parts/fast_slow.png` #0000ff / #ff0000(451 · 478개).
- Rm-skin `parts/fast_slow/character/Fast_Slow.png` #00c3ff / #ff1500(1447 · 1778개). High Contrast 판 #19ff00 / #ff00d0.
- 스킨은 바꿔 쓰는 것이라 게임 한 곳으로 센다. 파랑 / 빨강이 3종, 초록 / 자홍이 1종.

### unnamed-sdvx-clone

- 출처: Drewol/unnamed-sdvx-clone `bin/skins/Default/scripts/gameplay.lua`:996-1000, `result.lua`:1179-1180 · 2026-11-25
- EARLY `255,0,255`(#ff00ff) · LATE `0,255,255`(#00ffff). 코드 상수. 마젠타 / 시안 · 다크.

### Quaver

- 출처: Quaver/Quaver `Quaver.Shared/Skinning/SkinKeys.cs`:237(`HitErrorEarlyColor = Colors.MainBlue`) · :239(`HitErrorLateColor = Colors.Negative`), `Graphics/Colors.cs`:36 · :33 · 2026-11-25
- Early `9,165,200`(#09a5c8) · Late `255,152,164`(#ff98a4). `Colors.cs` 줄은 직접 대조해 일치 확인. 히트 에러 바 쐐기 색이고 설정 기본 켬, 스킨으로 바뀜. 결과 화면 편차 그래프는 방향 색 없이 판정색.

### 방향 색이 없는 곳

- osu!(lazer): `BarHitErrorMeter.cs`:296-331 라벨 Early / Late 에 색 지정 없음, 막대는 판정색 좌우 대칭. `AverageHitError.cs`:29-34.
- Etterna(Rebirth · Til Death): `errorbar.lua`:118-140 글자 색 지정 없음, 오프셋 플롯 글자 #ffffff(`01 color_config.lua`:96).
- Simply Love(ITGmania): `ErrorBar/Text.lua`:26-27 `EARLY` · `LATE` 글자 `#ffffff`, 위치로 방향(왼쪽 · 오른쪽 40px).
- StepMania 5 기본 테마: 판정 이미지 12칸 중 `param.Early` 로 칸을 골라 판정색 + 글자 옆 점 위치로 방향.
- 사이트 Tachi(Kamaitachi): `typescript/client/src/components/tables/dropdowns/components/JudgementTable.tsx`:20 · 24 `Slow: n` · `Fast: n` 글자만, 색 없음.
- 글자 색은 코드에 지정이 없어 기본 글자색(흰색)으로 본 것이고 렌더 화면에서 재지는 않았다.

## 못 잰 곳

- Project SEKAI: gamerch 이미지 4장을 열었으나 FAST · LATE 글자가 없음(표기는 FAST / LATE, 공식 지원 문서가 LATE · EARLY 표시 옵션 안내).
- Arcaea: Fandom 이미지 CDN 이 Cloudflare 확인 화면을 띄워 막힘(우회 안 함). Phigros · Rotaeno · Cytus II · Deemo II · Lanota · Dynamix · Voez: 글 · 이미지 근거 없음.
- pop'n music(공식 옵션 이미지 10장에 FAST/SLOW 없음) · NOSTALGIA(공식 howto · ノスしるべ에 이미지 없음, 정본 기록의 Fast #00c4a0 은 이 조사에서 확인 못 함) · GITADORA · REFLEC BEAT(RemyWiki 문장만) · jubeat(EARLY/LATE 를 색으로 나누지 않는다는 문장만).
- Taiko no Tatsujin · DJMAX RESPECT V · Rhythm Doctor · Clone Hero · YARG · Malody(소스 비공개) · OpenTaiko · DTXmania.
- 사이트: Etterna online(점수 표가 비어 나와 오프셋 플롯에 못 닿음) · GrooveStats(도메인이 풀리지 않음) · osu! 분석 사이트(열지 않음) · iidx.me(홈에 낱말 없음). maimai · CHUNITHM · DDR 공식 기록 사이트는 로그인 벽이라 세지 않음.

## 읽은 것

- 방향 색이 있는 게임 10곳 가운데 FAST 쪽이 파랑 · 하늘 · 청록이고 SLOW 쪽이 빨강 · 분홍인 곳이 8곳(IIDX · ONGEKI · maimai · CHUNITHM · beatoraja · Muse Dash · Quaver · DDR). 반대는 SDVX 1곳, 마젠타 / 시안은 USC 1곳.
- 가장 많은 꼴은 파랑 / 빨강 5곳이다. 정본 78행 「FAST 파랑 계통 · SLOW 빨강 계통」과 같은 방향이다.
- 방향 색 없이 글자 · 위치로만 말하는 곳이 4곳 + 사이트 1곳으로, 게임 판정 방향은 색 없이도 쓰인다.
