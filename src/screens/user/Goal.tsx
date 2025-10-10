import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  Text,
  View,
  Keyboard,
  TextInput,
  ScrollView,
  PanResponder,
  RefreshControl,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

import { TripApi } from '@api/trip';
import color from '@styles/color';
import { useGoal } from '@hooks/useGoal';
import { showMessage } from '@utils/toast';
import { setIsLoading } from '@stores/action';
import { userStyle } from '@styles/user.style';
import { IconLibrary } from '@components/base';
import ProgressBar from '@components/home/progressBar';
import { ActionButton } from '@components/home/actionButton';
import HeaderBackStatusBar from '@components/header/headerWithTitle';

const GoalScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const refreshControl = useRef<boolean>(false);
  const [targetCo2, setTargetCo2] = useState('');
  const [date, setDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const now = new Date();
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const selectedMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const isPastMonth = selectedMonth < currentMonth;

  const { goalList, reload } = useGoal(date);

  const handledPrev = () => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() - 1);
    setDate(newDate);
  };

  const handledNext = () => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + 1);
    setDate(newDate);
  };

  const handleCurrentMonth = () => {
    setDate(new Date());
  };

  const formatMonthYear = (date: Date) => {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${year}`;
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
      onPanResponderRelease: (_, gestureState) => {},
    }),
  ).current;

  const onAddGoal = async () => {
    const params = {
      target_co2: targetCo2,
      month: formatMonthYear(date),
    };
    if (!params.target_co2) {
      Keyboard.dismiss();
      showMessage.warning(t('missing_fields'));
      return;
    }
    Keyboard.dismiss();
    dispatch(setIsLoading(true));
    const res: any = await TripApi.creatGoal(params);
    if (res.code === 200) {
      dispatch(setIsLoading(false));
      setModalVisible(false);
      showMessage.success(
        t(
          Object.keys(goalList).length > 0
            ? 'update_goal_success'
            : 'add_goal_success',
        ),
      );
      setTargetCo2('');
      reload();
    } else {
      dispatch(setIsLoading(false));
      showMessage.fail(t('add_goal_failed'));
    }
  };

  const onRefresh = () => {
    refreshControl.current = true;
    reload();
    refreshControl.current = false;
  };

  return (
    <View style={userStyle.container} {...panResponder.panHandlers}>
      <HeaderBackStatusBar title={t('monthly_goal')} />
      <View style={userStyle.container}>
        <View style={userStyle.btnMonth}>
          <TouchableOpacity onPress={handledPrev}>
            <IconLibrary
              library="AntDesign"
              name="caretleft"
              size={24}
              color={color.MAIN}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCurrentMonth}>
            <Text style={userStyle.txtMonth}>
              {t('month')} {formatMonthYear(date)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handledNext}>
            <IconLibrary
              library="AntDesign"
              name="caretright"
              size={24}
              color={color.MAIN}
            />
          </TouchableOpacity>
        </View>
        <ScrollView
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              onRefresh={onRefresh}
              refreshing={refreshControl.current}
            />
          }
          contentContainerStyle={userStyle.scrollViewContent}
        >
          {Object.keys(goalList).length > 0 && (
            <>
              <View style={userStyle.viewGoal}>
                <Text style={userStyle.titleGoal}>
                  {t('emission_reduction_goal')}
                </Text>
                <Text style={userStyle.txtValueGoal}>
                  {goalList?.target_co2} g
                </Text>
                <View style={userStyle.viewProgress}>
                  <ProgressBar
                    max={goalList?.target_co2}
                    current={goalList?.achieved_co2}
                  />
                </View>
              </View>
              <View style={userStyle.progressCard}>
                <Text style={userStyle.titleProgressCard}>
                  {goalList?.achieved_co2 > goalList?.target_co2
                    ? t('exceeded_monthly_goal')
                    : `${t('monthly_emission_progress')} ${
                        goalList?.month || ''
                      }`}
                </Text>
                <Text style={userStyle.valueProgressCard}>
                  {goalList?.achieved_co2 || 0}g / {goalList?.target_co2 || 0}g
                  CO₂ 🌱
                </Text>
                <ProgressBar
                  max={goalList?.target_co2}
                  current={goalList?.achieved_co2}
                />
              </View>
            </>
          )}
        </ScrollView>
        {!isPastMonth && (
          <TouchableOpacity
            style={userStyle.viewAdd}
            activeOpacity={0.7}
            onPress={() => {
              setTargetCo2(goalList?.target_co2?.toString() || '');
              setModalVisible(true);
            }}
          >
            <IconLibrary
              library="Feather"
              name={Object.keys(goalList).length > 0 ? 'edit' : 'plus'}
              size={20}
              color="white"
            />
          </TouchableOpacity>
        )}
      </View>
      {modalVisible && (
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={userStyle.modelGoal}>
            <TouchableWithoutFeedback>
              <View style={userStyle.viewModalGoal}>
                <Text style={userStyle.titleModalGoal}>
                  {t(
                    Object.keys(goalList).length > 0
                      ? 'update_emission_reduction_goal'
                      : 'add_emission_reduction_goal',
                  )}
                </Text>
                <TextInput
                  value={targetCo2}
                  keyboardType="numeric"
                  onChangeText={setTargetCo2}
                  style={userStyle.inputGoal}
                  placeholder={t('enter_target_co2')}
                />
                <ActionButton
                  title={t(
                    Object.keys(goalList).length > 0
                      ? 'update_goal'
                      : 'add_co2_goal',
                  )}
                  onPress={onAddGoal}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

export default GoalScreen;
