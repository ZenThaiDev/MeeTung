"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MdKeyboardArrowLeft } from "@react-icons/all-files/md/MdKeyboardArrowLeft";
import { MdKeyboardArrowRight } from "@react-icons/all-files/md/MdKeyboardArrowRight";

import type { Transaction } from "@mee-tung/db";

import { api } from "~/trpc/react";

const months: Record<number, string> = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};

const curDate = new Date();
const curMonth = curDate.getMonth() + 1;
const curYear = curDate.getFullYear();

export function TransactionHistory() {
  const [view, setView] = useState("daily");
  const [monthView, setMonthView] = useState(curMonth);
  const [yearView, setYearView] = useState(curYear);

  const renderTransactionHistory = () => {
    switch (view) {
      case "daily":
        return (
          <DailyTransactionHistory
            monthView={monthView}
            changeMonthView={setMonthView}
            yearView={yearView}
            changeYearView={setYearView}
          />
        );
      case "monthly":
        return (
          <MonthlyTransactionHistory
            yearView={yearView}
            changeYearView={setYearView}
          />
        );
      // case "summary":
      //   return <TransactionHistorySummary />;
    }
  };

  return (
    <div className="flex h-screen max-w-full flex-col gap-2 overflow-hidden bg-gradient-to-b from-[#E9DDCD] to-[#E9C1C9] p-8 pt-36 transition-all dark:text-black md:pt-40 xl:pt-44">
      <TransactionHistoryNav
        view={view}
        changeView={setView}
        monthView={0}
        setMonthView={function (_month: number): void {
          return;
        }}
        yearView={0}
        setYearView={function (_year: number): void {
          return;
        }}
      />
      {renderTransactionHistory()}
    </div>
  );
}

export function TransactionHistoryNav({
  view,
  changeView,
}: {
  changeView: (view: string) => void;
  view: string;
  monthView: number;
  setMonthView: (month: number) => void;
  yearView: number;
  setYearView: (year: number) => void;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <button
          className={`flex-1 font-medium md:py-2 md:text-xl xl:py-4 ${view === "daily" ? "rounded-xl bg-[#766354] text-[#D8D6C7] shadow-inner" : " text-black"}`}
          onClick={() => changeView("daily")}
        >
          Daily
        </button>
        <button
          className={`flex-1 font-medium md:py-2 md:text-xl xl:py-4 ${view === "monthly" ? "rounded-xl bg-[#766354] text-[#D8D6C7] shadow-inner" : " text-black"}`}
          onClick={() => changeView("monthly")}
        >
          Monthly
        </button>
        {/* <button
          className={`flex-1 font-medium ${view === "summary" ? "rounded-xl bg-[#766354] text-[#D8D6C7] shadow-inner" : " text-black"}`}
          onClick={() => changeView("summary")}
        >
          Summary
        </button> */}
      </div>
    </div>
  );
}

export function TransactionDateNav({
  state,
  changeState,
  type,
}: {
  state: number;
  changeState: (state: number) => void;
  type: "month" | "year";
}) {
  let min = 1900;
  let max = curYear;
  if (type === "month") {
    min = 1;
    max = 12;
  }
  return (
    <div className="flex flex-row">
      <button
        className="border-1 m-auto h-fit w-fit justify-end p-1"
        onClick={() =>
          state > min ? changeState(state - 1) : changeState(state)
        }
      >
        <MdKeyboardArrowLeft size="20px" />
      </button>
      <div className="justify-center p-1 text-center text-sm font-semibold md:text-lg xl:text-xl">
        {type === "month" ? months[state] : state}
      </div>
      <button
        className="border-1 m-auto h-fit w-fit justify-start p-1"
        onClick={() =>
          state < max ? changeState(state + 1) : changeState(state)
        }
      >
        <MdKeyboardArrowRight size="20px" />
      </button>
    </div>
  );
}

export function TransactionHistoryTotal({
  month,
  year,
}: {
  month: number;
  year: number;
}) {
  const {
    data: transactionsTotals,
    isLoading,
    isError,
  } = api.transaction.getTransactionsTotalsByMonth.useQuery({
    month: month,
    year: year,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching transactions.</div>;
  }

  return (
    <div className="flex-rows flex max-w-full rounded-xl border border-black bg-[#BBA384] p-2">
      <div className="flex-1 flex-col text-center md:text-lg xl:text-xl">
        <div className="font-medium">Income</div>
        <div className="text-[#FEF8ED]">
          {transactionsTotals?.income.toFixed(2)}
        </div>
      </div>
      <div className="flex-1 flex-col text-center md:text-lg xl:text-xl">
        <div className="font-medium">Expense</div>
        <div className="text-[#FEF8ED]">
          {transactionsTotals?.expense.toFixed(2)}
        </div>
      </div>
      <div className="flex-1 flex-col text-center md:text-lg xl:text-xl">
        <div className="font-medium">Total</div>
        <div className="text-[#FEF8ED]">
          {transactionsTotals?.total.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

export function DailyTransactionHistory({
  monthView,
  changeMonthView,
  yearView,
  changeYearView,
}: {
  monthView: number;
  changeMonthView: (month: number) => void;
  yearView: number;
  changeYearView: (year: number) => void;
}) {
  const {
    data: dailyTransactions,
    isLoading,
    isError,
  } = api.transaction.getTransactionsByMonth.useQuery({
    month: monthView,
    year: yearView,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching transactions.</div>;
  }
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex flex-col gap-2 transition-all">
        <div className="flex flex-row justify-center p-2">
          <TransactionDateNav
            state={monthView}
            changeState={changeMonthView}
            type="month"
          />
          <TransactionDateNav
            state={yearView}
            changeState={changeYearView}
            type="year"
          />
        </div>
        <TransactionHistoryTotal month={monthView} year={yearView} />
      </div>

      <div className="mb-20 flex-1 overflow-x-hidden overflow-y-scroll p-2">
        {dailyTransactions &&
          Object.entries(dailyTransactions)
            .sort(
              ([dateA], [dateB]) =>
                new Date(dateA).getTime() - new Date(dateB).getTime(),
            )
            .map(([date, transactions]) => {
              return (
                <div key={date} className="py-2">
                  <div className="text-xl font-semibold">
                    {new Date(date)
                      .toUTCString()
                      .split(" ")
                      .slice(0, 3)
                      .join(" ")}
                  </div>
                  <div className="flex flex-col gap-2 py-3">
                    {transactions.map((transaction) => (
                      <DailyTransaction key={transaction.id} t={transaction} />
                    ))}
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}

export function MonthlyTransactionHistory({
  yearView,
  changeYearView,
}: {
  yearView: number;
  changeYearView: (year: number) => void;
}) {
  const {
    data: getMonthlyTransaction,
    isLoading,
    isError,
  } = api.transaction.getTransactionsByYear.useQuery({
    year: yearView,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching transactions.</div>;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="p-2">
        <TransactionDateNav
          state={yearView}
          changeState={changeYearView}
          type="year"
        />
      </div>
      <div className="mb-20 flex-1 overflow-x-hidden overflow-y-scroll p-2">
        {getMonthlyTransaction &&
          Object.entries(getMonthlyTransaction).map(([index, month]) => (
            <div key={index}>
              <div className="text-xl font-semibold md:text-2xl xl:text-3xl">
                {months[Number(index) + 1]}
              </div>
              <div className="py-2">
                <div className="flex flex-col gap-2 py-3">
                  <MonthlyTransaction weeks={month.weeks} />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

//haven't thought of what to do with summary but three buttons look good
export function TransactionHistorySummary() {
  return <p>summary</p>;
}

export function DailyTransaction({ t }: { t: Transaction }) {
  const router = useRouter();
  function handleClickTransaction(transactionId: string) {
    router.push("transaction/edit/" + transactionId);
  }
  //displays information of a single transaction
  const {
    data: paymentMethod,
    isLoading,
    isError,
  } = api.paymentmethod.getTypeById.useQuery({ id: t.paymentMethodId ?? "" });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching transactions.</div>;
  }

  const amount = Number(t.amount);
  return (
    <div
      onClick={() => handleClickTransaction(t.id)}
      className="border-1 flex flex-col rounded-xl border border-black bg-[#FEF8ED] p-4 md:text-2xl xl:text-3xl"
    >
      <div className="text-md font-medium">{t.description}</div>
      <div className="flex justify-between text-sm md:text-xl xl:text-2xl">
        <div className="flex-1 text-left">
          {paymentMethod?.name ?? "Unknown"}
        </div>
        <div
          className={`flex-none text-right ${amount > 0 ? "text-[#668329]" : "text-[#84342F]"}`}
        >
          {amount.toFixed(2)}
        </div>
      </div>
    </div>
  );
}

export function MonthlyTransaction({
  weeks,
}: {
  weeks: { week: number; total: number }[];
}) {
  console.log("weeks", weeks[0]);
  return (
    <div className="flex flex-col rounded-xl">
      <div className="r flex flex-row gap-2 rounded-t-xl border border-black bg-[#715F51] p-4 text-center md:text-2xl xl:text-3xl">
        <div className="flex flex-1 text-center text-[#FEF8ED]"></div>
        <div className=" text-[#FEF8ED]">Total</div>
      </div>
      {weeks[0] && <WeeklyTransaction week={weeks[0]} isLast={false} />}
      {weeks[1] && <WeeklyTransaction week={weeks[1]} isLast={false} />}
      {weeks[2] && <WeeklyTransaction week={weeks[2]} isLast={false} />}
      {weeks[3] && <WeeklyTransaction week={weeks[3]} isLast={true} />}
    </div>
  );
}

export function WeeklyTransaction({
  isLast,
  week,
}: {
  isLast: boolean;
  week: { week: number; total: number };
}) {
  console.log("small week", week);
  return (
    <div
      className={`flex flex-row border-b border-l border-r border-black bg-[#FEF8ED] p-4 md:text-xl xl:text-2xl ${isLast ? "rounded-b-xl" : ""}`}
    >
      <div className="text-md flex-1 text-start font-medium">
        Week {week.week}
      </div>
      <div className="align-center text-md flex-1 text-end">
        {week.total.toFixed(2)}
      </div>
    </div>
  );
}
