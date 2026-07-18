import Card from '../UI/Card';

export default function ChartCard({ title, children, className = '' }) {
  return (
    <Card className={className} hover={false}>
      <h3 className="text-lg font-display font-bold mb-4">{title}</h3>
      {children}
    </Card>
  );
}
