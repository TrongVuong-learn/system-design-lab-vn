import { parseObservation } from '@sdl/simulation-engine';
export function ObservationPanel({ value }: { value: unknown }) {
  const observation = parseObservation(value);
  if (!observation) return null;
  return (
    <section className="observation-panel" aria-label="So sánh bước vừa thử">
      <h3>Điều gì vừa thay đổi?</h3>
      <p className="muted">{observation.action} · So với ngay trước thao tác</p>
      <table>
        <caption className="sr-only">Trạng thái trước và sau thao tác</caption>
        <thead>
          <tr>
            <th scope="col">Đại lượng</th>
            <th scope="col">Trước</th>
            <th scope="col">Sau</th>
          </tr>
        </thead>
        <tbody>
          {observation.rows.map((r) => (
            <tr key={r.label}>
              <th scope="row">{r.label}</th>
              <td>{r.before}</td>
              <td className={r.before !== r.after ? 'observation-changed' : ''}>{r.after}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="observation-reason" role="status">
        {observation.reason}
      </p>
    </section>
  );
}
