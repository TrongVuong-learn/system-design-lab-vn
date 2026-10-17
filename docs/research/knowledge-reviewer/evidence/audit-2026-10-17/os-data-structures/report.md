# Review kiến thức: OS và cấu trúc dữ liệu nhập môn

- Checkout: `/Users/vuongn/.codex/worktrees/ui03-lesson-desk/System Design learning`; HEAD `8f2afa8bb6a6dc832ca246e1f41f01de9fcdd197`; `git status --short` rỗng lúc bắt đầu. Không có diff chưa commit trong phạm vi.
- Vai trò/profile: `knowledge_reviewer` 1.1.0; runtime yêu cầu `gpt-6-sol`, reasoning `low`. Đây là AI review, chưa phải human review.
- Phạm vi: bốn bài beta v1 `concurrency`, `cpu-io` (L0.2), `library-search`, `hash-table` (L0.3); story, explanation, limit, terms, prediction, challenge, caseStudy, guidance; engine, unit tests, UI lab source. Đọc README, CONTRIBUTING, WORKFLOW và REFERENCE_GUIDE. Không quan sát browser/thiết bị thật.
- Kết luận: **pass-with-scope**. Không tìm thấy lỗi kiến thức xác nhận P0/P1/P2 trong phạm vi đã kiểm. Điều này không bảo đảm toàn bộ học liệu chính xác. Ma trận nêu từng claim và giới hạn bằng chứng.

## Evidence chính

Nguồn sơ cấp đã mở ngày 2026-10-17:

- OSTEP v1.10 ch26 §§26.1, 26.3–26.4: thread chia sẻ address space, I/O blocked cho thread khác dùng CPU, read/add/store xen kẽ gây lost update. [Nguồn](https://pages.cs.wisc.edu/~remzi/OSTEP/threads-intro.pdf).
- OSTEP v1.10 ch28 §§28.1–28.2: lock bao vùng cập nhật chung, một thread vào critical section một lúc. [Nguồn](https://pages.cs.wisc.edu/~remzi/OSTEP/threads-locks.pdf).
- OSTEP v1.10 ch4 §4.4: blocked I/O, ready và running riêng; CPU có thể chuyển sang việc khác. [Nguồn](https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-intro.pdf). Ch36 §36.4 cũng đã mở [tại đây](https://pages.cs.wisc.edu/~remzi/OSTEP/file-devices.pdf).
- CMU 15-122 Spring 2026 lectures 4 và 6: tìm tuần tự và chia đôi cần mảng đã sắp, loại nửa theo phép so giữa. [Lecture 4](https://www.cs.cmu.edu/~15122-archive/s26/handouts/lectures/04-linsearch.pdf), [lecture 6](https://www.cs.cmu.edu/~15122-archive/s26/handouts/lectures/06-binsearch.pdf).
- MIT 6.006 Fall 2011 lecture 8: khóa va chạm khi cùng slot, chaining và worst case một chain dài N. [Nguồn](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/d3e4d64266d481c74c9e7c15e09999fe_MIT6_006F11_lec08.pdf); đối chiếu thêm [CMU 15-122 lecture 13 (2014)](https://www.cs.cmu.edu/afs/cs.cmu.edu/academic/class/15122-s14/www/13-hashtables.pdf).

Các số 30/32, 1–3–1 ms, 4 ms CPU, 8/32/128 mã và các khóa 2/6/10/14 là giả định tác giả, không gán thành benchmark từ nguồn. Tính độc lập trước khi chạy: lịch `ABAB` đọc 30 hai lần nên 31; khóa buộc mỗi lượt đọc sau lượt ghi trước nên 32. CPU/I/O: 1 worker hoàn tất ở 10 ms, 2 worker 6 ms theo timeline độc lập; loại CPU tổng 8 ms ở cả hai. Search cuối dãy N=8/32/128: tuần tự N, chia đôi 4/6/8; mã đầu tuần tự 1. Hash: B=4 mọi khóa vào ngăn 2, B=8 tách [2,10] và [6,14]; mã 18 không có nhưng vẫn cần so chain.

`trace.mjs` chạy bằng `node --experimental-strip-types` trên Node v26.11.1; kết quả chi tiết ở `traces.json`. Đã xét prefix, đổi cấu hình làm reset (đọc source), restore version/step (trace), và giới hạn input trong engine. Unit test riêng thử chạy nhưng Vitest lỗi `EPERM` khi viết `node_modules/.vite-temp` trong worktree chỉ đọc; đây là blocker môi trường, **không phải test pass**. Trace script chạy thành công. UI chỉ đối chiếu source; không báo browser-observed.

## Findings

Không có finding xác nhận. Giới hạn còn lại: chưa chạy browser, chưa kiểm mobile/assistive tech trực tiếp; test suite không chạy được trong checkout chỉ đọc. Không suy các mô hình này thành hành vi OS, dữ liệu thật hay tốc độ phần cứng. Parent cần rà evidence trước sửa hoặc phát hành nếu thay cơ chế hay đáp án.
