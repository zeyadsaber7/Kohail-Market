/** Icon + title + optional subtitle used to introduce every homepage section. */
export default function SectionHeader({ icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center">{icon}</div>
      <div>
        <h2 className="text-lg md:text-xl font-extrabold text-brand">{title}</h2>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>
    </div>
  );
}
