import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnnualCashflow } from "@/data/getAnnualCashflow";
import CashflowFilters from "./cashflow-filters";
import { getTransactionYearsRange } from "@/data/getTransactionYearsRange";
import { CashflowContent } from "./cashflow-content";

export default async function Cashflow({ year }: { year: number }) {
  const [cashflow, yearsRange] = await Promise.all([
    getAnnualCashflow(year),
    getTransactionYearsRange(),
  ]);

  return (
    <Card className="mb-5">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Cashflow</span>
          <CashflowFilters year={year} yearsRange={yearsRange} />
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-[1fr_250px]">
        <CashflowContent annualCashflow={cashflow} />
      </CardContent>
    </Card>
  );
}
