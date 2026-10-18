# EDU-23 — lô cookie/session, reverse proxy và HTTP multiplexing

Scope18/10/2026: bổ sung3bàiL0.5 khi EDU-22 quaCI, không chờ user test từng bài. Engine1.14.0/model1; checkpoint config/step0–3 replayderive, không tin state nhập; progressJSON1/IndexedDB2 giữ. Không thêm auth thật vào website học. Không đóngL0.5/toàn roadmap bằng số bài.

Nguồn đọc trước soạn: RFC6265§1/3/8.4, RFC9110§3.7, RFC9113§1–2, RFC9114§1–2; RFC9000 được mở nhưng claim cốt lõi dùng RFC9114. CookieID/sessionserver là cách thiết kế của ví dụ, không mọi cookie. Reverseproxy khác forwardproxy/cache. Multiplexing so một lỗi dữ liệuA trướcB trên mộtconnection; không QPACK/header dependency, flowcontrol/congestion hoặc đo tốc độ, không nóiHTTP3 luôn nhanh hơn.

Mô hình: S1→An server, browsergiữ/bỏ hoặcserverthu hồi, requestlại; route /lop→Máylịch, /anh→Máyảnh quaportal.example hoặcdirect; hairesponse độc lập đãgiảimãheader, A đến/mất→Bđến→Aphụchồi. TCPgiữB saukhoảngbyte thiếu; QUICgiaoBriêngtrongvídụ. Không cookie/file/network thật. Parent kiểm nguồn/engine/trace/assessment, reviewerTypeagent, không humanreview/pilot.

Acceptance: lifecycle riêng cookie/server, host/path/backend đúng, fixture transportHOL có/khôngloss và trạng thái received/delivered, model/invalid/immutability; schema/source/case/prereq/compatibility26ID; keyboard/focus/resume/challenge4browser, responsive320–1440, export/import/offline và ảnh320/390/1280. CI/merge/master/Vercel kiểm đúngSHA/artifact trước phát hành; giữ phụ thuộc/runtime.

## Kết quả local

94unit/26files, content/coverage/lint/format/build đạt. 32/32E2E liên quan đạt trên source29bài+1ôn:12test bài mới4browser,12offline,7responsive320–1440 và1reducedmotion/landscape. 26contract cũ deep-equal, chỉ thêm3ID. Không đổi runtime/dependency/storage.

Standalone cả3bài tại320/390/1280: export/import checkpoint2, reload offline rồi hoàn tấtrequest/routing/recovery đạt, không overflow/pageerror. Đã xem ảnh mobile/desktop thật: cookie/server hai ô riêng, proxy route trace, transportBreceived khácBdelivered có chữ, không chỉ màu. Evidence `.cache/edu23/` ignored; sourceOS trongbranch cha đã quaQA riêng, không ghi test29bài là bản đã phát hành trước merge.

## CI và production

[PR#16](https://github.com/TrongVuong-learn/system-design-lab-vn/pull/16) merge thành `20525f851a48540b13180b70152ec75977bdbeca`. Nhánh chỉ rebase trước public, tree bằng source37b4a6e đãtest. [Quality39093418173](https://github.com/TrongVuong-learn/system-design-lab-vn/actions/runs/39093418173) success94unit/255E2E,1skip theo cấu hình cũ.

Vercel `dpl_3JVftPiVfFrTaTHHLEWnrpisoiqQ` READY production/master20525f8, alias https://system-design-lab-vn.vercel.app. 18file HTTP/hash/cache/MIME đúng, missingJS404. Chromium320/390/1280 của3bài export/import/checkpoint2/reload offline rồi hoàn tất request/routing/recovery đạt, khôngoverflow/pageerror. Evidence `.cache/edu23/{release,tested-artifact,cloud-http,live-browser}.json` ignored.

Scope3bài đã phát hành, không đóngL0.5/giáo trình, không humanreview/pilot hoặc thiết bị thật. Gói offline cũ cần tải bản mới tại Tiến độ và đóng tab cũ để kích hoạt, giữ tiến độ. Bản tiếp theo cókhung practice từmaster, không coi đó là nguồn đã cótrong runCI này.
