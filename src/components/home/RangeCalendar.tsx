import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Alert,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import normalize from 'react-native-normalize';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CalendarList, LocaleConfig } from 'react-native-calendars';

import color from '@styles/color';
import themeStyle from '@styles/theme.style';
import { IconLibrary } from '@components/base';

LocaleConfig.locales['vi'] = {
  monthNames: [
    'Tháng Một',
    'Tháng Hai',
    'Tháng Ba',
    'Tháng Tư',
    'Tháng Năm',
    'Tháng Sáu',
    'Tháng Bảy',
    'Tháng Tám',
    'Tháng Chín',
    'Tháng Mười',
    'Tháng Mười Một',
    'Tháng Mười Hai',
  ],
  monthNamesShort: [
    'Th1',
    'Th2',
    'Th3',
    'Th4',
    'Th5',
    'Th6',
    'Th7',
    'Th8',
    'Th9',
    'Th10',
    'Th11',
    'Th12',
  ],
  dayNames: [
    'Chủ Nhật',
    'Thứ Hai',
    'Thứ Ba',
    'Thứ Tư',
    'Thứ Năm',
    'Thứ Sáu',
    'Thứ Bảy',
  ],
  dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  today: 'Hôm nay',
};
LocaleConfig.locales['en'] = {
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  monthNamesShort: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
  dayNames: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  today: 'Today',
};

const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const getDatesBetween = (start: Date, end: Date): string[] => {
  const dates: string[] = [];
  let current = new Date(start);
  while (current <= end) {
    dates.push(formatDate(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

const displayDate = (dateStr: string | null) => {
  if (!dateStr) return 'Chọn ngày';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
};

const getMarkedRange = (start: string | null, end: string | null) => {
  if (!start || !end) return {};
  const startDate = new Date(start);
  const endDate = new Date(end);
  const range = getDatesBetween(startDate, endDate);
  const marked: any = {};
  range.forEach((d, i) => {
    if (i === 0)
      marked[d] = { startingDay: true, color: color.MAIN, textColor: '#fff' };
    else if (i === range.length - 1)
      marked[d] = { endingDay: true, color: color.MAIN, textColor: '#fff' };
    else marked[d] = { color: '#99EBD1', textColor: '#000' };
  });
  return marked;
};

interface RangeCalendarProps {
  startDate: string | null;
  endDate: string | null;
  setStartDate: (date: string | null) => void;
  setEndDate: (date: string | null) => void;
  refetch: (startDate: any, endDate: any) => void;
}

export const RangeCalendar = ({
  refetch,
  endDate,
  startDate,
  setEndDate,
  setStartDate,
}: RangeCalendarProps) => {
  const { t, i18n } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [markedDates, setMarkedDates] = useState(
    getMarkedRange(startDate, endDate),
  );
  LocaleConfig.defaultLocale = i18n.language;

  const onDayPress = (day: any) => {
    const date = day.dateString;
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
      setMarkedDates({
        [date]: {
          startingDay: true,
          color: color.MAIN,
          textColor: '#fff',
        },
      });
      return;
    }
    const start = new Date(startDate);
    const end = new Date(date);
    let realStart = start;
    let realEnd = end;
    if (end < start) {
      realStart = end;
      realEnd = start;
    }
    setStartDate(formatDate(realStart));
    setEndDate(formatDate(realEnd));
    const range = getDatesBetween(realStart, realEnd);
    const marked: any = {};
    range.forEach((d, i) => {
      if (i === 0) {
        marked[d] = { startingDay: true, color: color.MAIN, textColor: '#fff' };
      } else if (i === range.length - 1) {
        marked[d] = { endingDay: true, color: color.MAIN, textColor: '#fff' };
      } else {
        marked[d] = { color: '#99EBD1', textColor: '#000' };
      }
    });
    setMarkedDates(marked);
  };

  const handleConfirm = () => {
    if (!endDate) {
      Alert.alert(t('please_select_end_date'));
      return;
    }
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
    setStartDate(null);
    setEndDate(null);
    setMarkedDates({});
    refetch("", "")
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.rangeBox}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.rangeText}>
          {startDate ? displayDate(startDate) : t('start_date')}
        </Text>
        <View style={styles.calendarIcon}>
          <IconLibrary
            library="Ionicons"
            name="arrow-forward-outline"
            size={20}
            color={color.MAIN}
          />
        </View>
        <Text style={styles.rangeText}>
          {endDate ? displayDate(endDate) : t('end_date')}
        </Text>
        <TouchableOpacity style={styles.calendarIcon} onPress={handleCancel}>
          <IconLibrary
            library="Ionicons"
            name={
              startDate || endDate ? 'close-circle' : 'calendar-clear-outline'
            }
            size={20}
            color={color.DUSTY_GRAY}
          />
        </TouchableOpacity>
      </TouchableOpacity>
      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <CalendarList
              horizontal
              pagingEnabled
              pastScrollRange={12}
              futureScrollRange={12}
              markingType="period"
              markedDates={markedDates}
              onDayPress={onDayPress}
              monthFormat={'MMMM yyyy'}
              theme={{
                todayTextColor: color.CRIMSON,
                arrowColor: color.CRIMSON,
                textDayFontWeight: '500',
                textMonthFontWeight: 'bold',
                textMonthFontSize: 18,
                textDayFontFamily: themeStyle.FONT_FAMILY,
                textMonthFontFamily: themeStyle.FONT_BOLD,
                textDayHeaderFontFamily: themeStyle.FONT_FAMILY,
              }}
            />
            <SafeAreaView style={styles.actionRow}>
              <Pressable
                style={[styles.actionBtn, { backgroundColor: '#ddd' }]}
                onPress={handleCancel}
              >
                <Text
                  style={{ fontSize: 14, fontFamily: themeStyle.FONT_FAMILY }}
                >
                  {t('cancel')}
                </Text>
              </Pressable>
              <Pressable
                style={[styles.actionBtn, { backgroundColor: color.MAIN }]}
                onPress={handleConfirm}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: '600',
                    fontSize: 14,
                    fontFamily: themeStyle.FONT_FAMILY,
                  }}
                >
                  {t('done')}
                </Text>
              </Pressable>
            </SafeAreaView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: normalize(16),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  summary: {
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  actionBtn: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  rangeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: normalize(16),
    backgroundColor: '#fff',
    width: '100%',
  },
  rangeText: {
    color: '#666',
    fontSize: 14,
    flex: 4,
    fontFamily: themeStyle.FONT_FAMILY,
  },
  calendarIcon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
