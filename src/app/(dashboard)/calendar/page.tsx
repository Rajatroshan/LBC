'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { festivalController } from '@/controllers/festival.controller';
import { Festival } from '@/models';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { formatCurrency } from '@/utils';
import { APP_ROUTES } from '@/core/routes';
import Link from 'next/link';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function isToday(year: number, month: number, day: number): boolean {
  const today = new Date();
  return (
    today.getFullYear() === year &&
    today.getMonth() === month &&
    today.getDate() === day
  );
}

export default function CalendarPage() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [view, setView] = useState<'month' | 'year'>('month');

  const loadFestivals = useCallback(async () => {
    setLoading(true);
    try {
      const data = await festivalController.getAllFestivals();
      setFestivals(data);
    } catch (err) {
      console.error('Failed to load festivals:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFestivals();
  }, [loadFestivals]);

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDate(null);
  };

  const goToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDate(null);
  };

  const getFestivalsForDate = (year: number, month: number, day: number): Festival[] => {
    return festivals.filter((f) => {
      const festDate = new Date(f.date);
      return (
        festDate.getFullYear() === year &&
        festDate.getMonth() === month &&
        festDate.getDate() === day
      );
    });
  };

  const getFestivalsForMonth = (year: number, month: number): Festival[] => {
    return festivals.filter((f) => {
      const festDate = new Date(f.date);
      return festDate.getFullYear() === year && festDate.getMonth() === month;
    });
  };

  const getUpcomingFestivals = (): Festival[] => {
    const now = new Date();
    return festivals
      .filter((f) => new Date(f.date) >= now && f.isActive)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  };

  const selectedDateFestivals = selectedDate
    ? getFestivalsForDate(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
    : [];

  const monthFestivals = getFestivalsForMonth(currentYear, currentMonth);

  // Calendar grid
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Festival Calendar</h1>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={view === 'month' ? 'primary' : 'outline'}
            onClick={() => setView('month')}
          >
            Month
          </Button>
          <Button
            size="sm"
            variant={view === 'year' ? 'primary' : 'outline'}
            onClick={() => setView('year')}
          >
            Year Overview
          </Button>
        </div>
      </div>

      {view === 'month' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Grid */}
          <div className="lg:col-span-2">
            <Card padding="lg">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <Button size="sm" variant="ghost" onClick={goToPrevMonth}>
                  ← Prev
                </Button>
                <div className="text-center">
                  <h2 className="text-xl font-bold text-gray-800">
                    {MONTH_NAMES[currentMonth]} {currentYear}
                  </h2>
                  <p className="text-xs text-gray-500">{monthFestivals.length} festival(s) this month</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={goToToday}>
                    Today
                  </Button>
                  <Button size="sm" variant="ghost" onClick={goToNextMonth}>
                    Next →
                  </Button>
                </div>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {DAY_NAMES.map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-semibold text-gray-500 py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: totalCells }).map((_, idx) => {
                  const dayNum = idx - firstDay + 1;
                  const isCurrentMonth = dayNum >= 1 && dayNum <= daysInMonth;
                  const dayFestivals = isCurrentMonth
                    ? getFestivalsForDate(currentYear, currentMonth, dayNum)
                    : [];
                  const isTodayCell = isCurrentMonth && isToday(currentYear, currentMonth, dayNum);
                  const isSelected =
                    isCurrentMonth &&
                    selectedDate &&
                    isSameDay(selectedDate, new Date(currentYear, currentMonth, dayNum));

                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        if (isCurrentMonth) {
                          setSelectedDate(new Date(currentYear, currentMonth, dayNum));
                        }
                      }}
                      className={`
                        min-h-[80px] p-1.5 rounded-lg border cursor-pointer transition-all
                        ${!isCurrentMonth ? 'bg-gray-50 border-transparent cursor-default' : 'border-gray-100 hover:border-primary-300 hover:shadow-sm'}
                        ${isTodayCell ? 'border-primary-500 bg-primary-50' : ''}
                        ${isSelected ? 'ring-2 ring-primary-500 bg-primary-50' : ''}
                      `}
                    >
                      {isCurrentMonth && (
                        <>
                          <div className={`text-sm font-medium ${isTodayCell ? 'text-primary-700' : 'text-gray-700'}`}>
                            {dayNum}
                          </div>
                          {dayFestivals.map((f) => (
                            <div
                              key={f.id}
                              className={`mt-1 text-xs px-1.5 py-0.5 rounded truncate ${
                                f.isActive
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-200 text-gray-600'
                              }`}
                              title={f.name}
                            >
                              🎉 {f.name}
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Selected date panel */}
            {selectedDate ? (
              <Card>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  {selectedDate.toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h3>
                {selectedDateFestivals.length === 0 ? (
                  <p className="text-gray-500 text-sm">No festivals on this date.</p>
                ) : (
                  <div className="space-y-3">
                    {selectedDateFestivals.map((f) => (
                      <Link key={f.id} href={APP_ROUTES.FESTIVAL_DETAIL(f.id)}>
                        <div className="p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                          <p className="font-medium text-gray-800">{f.name}</p>
                          <p className="text-sm text-gray-600">
                            Type: {f.type.replace(/_/g, ' ')}
                          </p>
                          <p className="text-sm font-semibold text-primary-600 mt-1">
                            {formatCurrency(f.amountPerFamily)} per family
                          </p>
                          {f.description && (
                            <p className="text-xs text-gray-500 mt-1">{f.description}</p>
                          )}
                          <span
                            className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                              f.isActive ? 'bg-green-200 text-green-800' : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {f.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </Card>
            ) : (
              <Card>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Select a Date
                </h3>
                <p className="text-sm text-gray-500">
                  Click on a date in the calendar to see festival details.
                </p>
              </Card>
            )}

            {/* Upcoming festivals */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Upcoming Festivals
              </h3>
              {getUpcomingFestivals().length === 0 ? (
                <p className="text-gray-500 text-sm">No upcoming festivals.</p>
              ) : (
                <div className="space-y-3">
                  {getUpcomingFestivals().map((f) => {
                    const festDate = new Date(f.date);
                    const daysUntil = Math.ceil(
                      (festDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                    );
                    return (
                      <Link key={f.id} href={APP_ROUTES.FESTIVAL_DETAIL(f.id)}>
                        <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <div>
                            <p className="text-sm font-medium text-gray-800">{f.name}</p>
                            <p className="text-xs text-gray-500">
                              {festDate.toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 font-medium">
                            {daysUntil === 0
                              ? 'Today'
                              : daysUntil === 1
                              ? 'Tomorrow'
                              : `${daysUntil} days`}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Month summary */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {MONTH_NAMES[currentMonth]} Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Festivals:</span>
                  <span className="font-semibold">{monthFestivals.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active:</span>
                  <span className="font-semibold text-green-600">
                    {monthFestivals.filter((f) => f.isActive).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Expected Collection:</span>
                  <span className="font-semibold text-primary-600">
                    {formatCurrency(
                      monthFestivals
                        .filter((f) => f.isActive)
                        .reduce((sum, f) => sum + f.amountPerFamily, 0)
                    )}
                    /family
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        /* Year Overview */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {MONTH_NAMES.map((monthName, monthIdx) => {
            const mFestivals = getFestivalsForMonth(currentYear, monthIdx);
            const mDays = getDaysInMonth(currentYear, monthIdx);
            const mFirstDay = getFirstDayOfMonth(currentYear, monthIdx);
            const isCurrent =
              monthIdx === today.getMonth() && currentYear === today.getFullYear();

            return (
              <Card
                key={monthIdx}
                className={`cursor-pointer hover:shadow-lg transition-shadow ${
                  isCurrent ? 'ring-2 ring-primary-500' : ''
                }`}
                padding="sm"
              >
                <div
                  onClick={() => {
                    setCurrentMonth(monthIdx);
                    setView('month');
                    setSelectedDate(null);
                  }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-800 text-sm">{monthName}</h3>
                    {mFestivals.length > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                        {mFestivals.length} 🎉
                      </span>
                    )}
                  </div>
                  {/* Mini calendar */}
                  <div className="grid grid-cols-7 gap-px text-center">
                    {DAY_NAMES.map((d) => (
                      <div key={d} className="text-[9px] text-gray-400 font-medium">
                        {d[0]}
                      </div>
                    ))}
                    {Array.from({ length: mFirstDay }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}
                    {Array.from({ length: mDays }).map((_, i) => {
                      const dayNum = i + 1;
                      const hasFestival = mFestivals.some((f) => {
                        const d = new Date(f.date);
                        return d.getDate() === dayNum;
                      });
                      const isTodayMini =
                        isToday(currentYear, monthIdx, dayNum);
                      return (
                        <div
                          key={dayNum}
                          className={`text-[10px] py-0.5 rounded ${
                            hasFestival
                              ? 'bg-green-500 text-white font-bold'
                              : isTodayMini
                              ? 'bg-primary-200 text-primary-800 font-bold'
                              : 'text-gray-600'
                          }`}
                        >
                          {dayNum}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Year navigation for year view */}
      {view === 'year' && (
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentYear((y) => y - 1)}
          >
            ← {currentYear - 1}
          </Button>
          <span className="px-4 py-2 font-bold text-gray-800">{currentYear}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentYear((y) => y + 1)}
          >
            {currentYear + 1} →
          </Button>
        </div>
      )}
    </div>
  );
}
