import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTransactionsByMonth } from "@/data/getTransactionsByMonth";
import { format } from "date-fns";
import { PencilIcon } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import numeral from "numeral";
import { Badge } from "@/components/ui/badge";
import Filters from "./filters";
import { getTransactionYearsRange } from "@/data/getTransactionYearsRange";

const today = new Date();

const searchSchema = z.object({
  year: z.coerce
    .number()
    .min(today.getFullYear() - 100)
    .max(today.getFullYear() + 1)
    .catch(today.getFullYear()),
  month: z.coerce
    .number()
    .min(1)
    .max(12)
    .catch(today.getMonth() + 1),
});

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  const searchParamsValues = await searchParams;

  const { month, year } = searchSchema.parse(searchParamsValues);

  const selectedDate = new Date(year, month - 1, 1);

  const transactions = await getTransactionsByMonth({ month, year });

  const yearsRange = await getTransactionYearsRange();

  console.log({ transactions });

  return (
    <div className="max-w-screen-xl mx-auto py-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Transactions</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>{format(selectedDate, "MMM yyyy")} Transactions</span>
            <div>
              <Filters year={year} month={month} yearsRange={yearsRange} />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/dashboard/transactions/new">New Transaction</Link>
          </Button>
          {!transactions?.length && (
            <p className="text-center py-10 text-lg text-muted-foreground">
              There are no transactions for this month
            </p>
          )}
          {!!transactions?.length && (
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {format(transaction.transactionDate, "do MMM yyyy")}
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell className="capitalize">
                      <Badge
                        className={
                          transaction.transactionType === "income"
                            ? "bg-lime-500"
                            : "bg-orange-500"
                        }
                      >
                        {transaction.transactionType}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell>
                      £{numeral(transaction.amount).format("0,0[.]00")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        asChild
                        size="icon"
                        aria-label="Edit transaction"
                      >
                        <Link
                          href={`/dashboard/transactions/${transaction.id}`}
                        >
                          <PencilIcon />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
