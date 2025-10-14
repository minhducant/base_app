import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View, ScrollView } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

import color from '@styles/color';
import themeStyle from '@styles/theme.style';
import { useReport } from '@hooks/useReport';
import { userStyle } from '@styles/user.style';
import SwitchButton from '@components/home/SwitchButton';
import { RangeCalendar } from '@components/home/RangeCalendar';
import HeaderBackStatusBar from '@components/header/headerWithTitle';

const formatLocalDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const ReportScreen = () => {
  const { t } = useTranslation();
  const now = new Date();
  const firstDay = formatLocalDate(
    new Date(now.getFullYear(), now.getMonth(), 1),
  );
  const lastDay = formatLocalDate(
    new Date(now.getFullYear(), now.getMonth() + 1, 0),
  );
  const [type, setType] = useState<'personal' | 'business'>('personal');
  const [startDate, setStartDate] = useState<string | null>(firstDay);
  const [endDate, setEndDate] = useState<string | null>(lastDay);
  const { reportData, refetch, setReportData } = useReport({
    startDate,
    endDate,
    type,
  });
  const { total = 0, vehicles = {} } = reportData?.by_vehicle || {};

  useEffect(() => {
    if (startDate && endDate) {
      refetch(startDate, endDate, type);
    } else {
      setReportData({});
    }
  }, [startDate, endDate, type]);

  const getAllDatesInRange = (start: string | any, end: string | any) => {
    const dates: string[] = [];
    let current = new Date(start);
    const endD = new Date(end);
    while (current <= endD) {
      const dateStr = current.toISOString().split('T')[0];
      dates.push(dateStr);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const lineData = useMemo(() => {
    if (!startDate || !endDate) return [];
    const allDates = getAllDatesInRange(startDate, endDate);
    return allDates.map(date => {
      const found = reportData?.daily?.find(
        (item: { date: string }) => item.date === date,
      );
      const day = new Date(date).getDate();
      const month = new Date(date).getMonth() + 1;
      return {
        value: found ? found.value : 0,
        label: `${day}/${month}`,
      };
    });
  }, [startDate, endDate, reportData]);

  const VehicleItem = ({ name, value, total }: any) => {
    const percent = total > 0 ? Math.round((value / total) * 100) : 0;
    const displayValue = Number.isInteger(value) ? value : value.toFixed(2);

    return (
      <View style={userStyle.itemReport}>
        <View style={userStyle.textReport}>
          <View style={userStyle.infoReport}></View>
          <Text style={userStyle.nameReport}>{t(name)}</Text>
          <Text style={userStyle.percentReport}>{percent}%</Text>
        </View>
        <Text style={userStyle.valueReport}>{displayValue} g</Text>
      </View>
    );
  };

  return (
    <View style={userStyle.container}>
      <HeaderBackStatusBar title={t('emission_report')} />
      <SwitchButton type={type} onChange={setType} />
      <RangeCalendar
        endDate={endDate}
        startDate={startDate}
        setEndDate={setEndDate}
        setStartDate={setStartDate}
        refetch={(sDate, eDate) => refetch(sDate, eDate)}
      />
      <View style={userStyle.viewChart}>
        <Text style={userStyle.titleChart}>{t('co2_emission_chart')}</Text>
        <View style={{ width: '100%', overflow: 'hidden' }}>
          <LineChart
            areaChart
            curved
            isAnimated
            showDataPointOnFocus
            data={lineData}
            height={220}
            spacing={44}
            initialSpacing={22}
            color1={color.MAIN}
            startFillColor1={color.MAIN}
            startOpacity={0.8}
            endOpacity={0.3}
            textShiftY={-2}
            textShiftX={-5}
            textFontSize={13}
            xAxisLabelTextStyle={{
              fontFamily: themeStyle.FONT_FAMILY,
              fontSize: 13,
              color: color.DUSTY_GRAY,
            }}
            yAxisTextStyle={{
              fontFamily: themeStyle.FONT_FAMILY,
              fontSize: 13,
              color: color.DUSTY_GRAY,
            }}
            dataPointsColor={color.MAIN}
            hideRules
            xAxisThickness={0}
            yAxisThickness={0}
            textColor="black"
            showValuesAsDataPointsText
          />
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={userStyle.viewCreateJournal}
      >
        {Object.keys(vehicles).map(key => (
          <VehicleItem
            key={key}
            name={key}
            value={vehicles[key]}
            total={total}
          />
        ))}
        <View style={[userStyle.totalItemReport]}>
          <View style={userStyle.textReport}>
            <Text style={userStyle.nameReport}>{t('total')}</Text>
          </View>
          <Text style={userStyle.valueReport}>
            {Number.isInteger(total) ? total : total.toFixed(2)} g
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default ReportScreen;
