import React, { useState, useRef, useCallback } from 'react';
import {
  Text,
  View,
  Animated,
  TextInput,
  Dimensions,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useDispatch } from 'react-redux';

import { t } from '@i18n/index';
import { SurveyApi } from '@api/survey';
import { useSurvey } from '@hooks/useSurvey';
import { showMessage } from '@utils/index';
import { setIsLoading } from '@stores/action';
import SwitchSurvey from '@components/home/SwitchSurvey';
import { homeStyle as styles } from '@styles/home.style';
import { ActionButton } from '@components/home/actionButton';
import HeaderBackStatusBar from '@components/header/headerWithTitle';

const WIDTH = Dimensions.get('screen').width;

type TabType = 'survey' | 'rating';

export default function SurveyScreen({ navigation }: any) {
  const dispatch = useDispatch();
  const scrollRef = useRef<ScrollView>(null);
  const refreshControl = useRef<boolean>(false);
  const scrollX = useRef(new Animated.Value(0)).current;
  const { surveyList, refetch } = useSurvey() as {
    surveyList: any;
    refetch: () => void;
  };
  const [activeTab, setActiveTab] = useState<'survey' | 'rating'>('survey');
  const [answers, setAnswers] = useState({
    // I. Tần suất
    used_duration: null, // less_than_week | 1_4_weeks | 1_3_months | more_than_3_months
    frequency_usage: null, // daily | 2_3_week | once_week | less
    // II. UX
    ux_easy: null, // very_easy | easy | average | difficult | very_difficult
    encountered_issues: null, // frequently | occasionally | rarely | never
    speed_satisfaction: null, // very_satisfied | satisfied | neutral | dissatisfied
    // III. Features
    features_enough: null, // yes | almost | missing_few | missing_many
    most_used_feature: '',
    ineffective_feature_exists: null, // yes | no
    ineffective_feature_detail: '',
    desired_features: '',
    // IV. UI
    ui_design_rating: null, // very_modern | clear | average | cluttered
    ui_colors_help: null, // yes | partly | no
    // V. Overall
    overall_rating: null, // 1..5 (number)
    recommend: null, // yes | maybe | no
    liked_most: '',
    want_improve: '',
    // VI. Open
    suggestions: '',
  });

  const set = (key: any, value: any) =>
    setAnswers(s => ({ ...s, [key]: value }));

  const handleTabChange = useCallback((tab: TabType) => {
    const pageIndex = tab === 'survey' ? 0 : 1;
    scrollRef.current?.scrollTo({
      x: pageIndex * WIDTH,
      animated: true,
    });
    setActiveTab(tab);
  }, []);

  const handleMomentumScrollEnd = useCallback(
    (event: any) => {
      const xOffset = event.nativeEvent.contentOffset.x;
      const pageIndex = Math.round(xOffset / WIDTH);
      const newTab: TabType = pageIndex === 0 ? 'survey' : 'rating';
      if (newTab !== activeTab) setActiveTab(newTab);
    },
    [activeTab],
  );

  const onSurvey = async () => {
    const requiredFields: (keyof typeof answers)[] = [
      'used_duration',
      'frequency_usage',
      'ux_easy',
      'encountered_issues',
      'speed_satisfaction',
      'features_enough',
      'ui_design_rating',
      'overall_rating',
      'recommend',
    ];
    const isIncomplete = requiredFields.some(key => !answers[key]);
    if (isIncomplete) {
      showMessage.fail(t('please_complete_all_required_fields'));
      return;
    }
    const params = {
      used_duration: answers.used_duration,
      frequency_usage: answers.frequency_usage,
      ux_easy: answers.ux_easy,
      encountered_issues: answers.encountered_issues,
      speed_satisfaction: answers.speed_satisfaction,
      features_enough: answers.features_enough,
      most_used_feature: answers.most_used_feature?.trim() || null,
      ineffective_feature_exists: answers.ineffective_feature_exists,
      ineffective_feature_detail:
        answers.ineffective_feature_detail?.trim() || null,
      desired_features: answers.desired_features?.trim() || null,
      ui_design_rating: answers.ui_design_rating,
      ui_colors_help: answers.ui_colors_help,
      overall_rating: answers.overall_rating,
      recommend: answers.recommend,
      liked_most: answers.liked_most?.trim() || null,
      want_improve: answers.want_improve?.trim() || null,
      suggestions: answers.suggestions?.trim() || null,
    };

    try {
      dispatch(setIsLoading(true));
      const res = await SurveyApi.createSurvey(params);
      if (res?.client_id) {
        showMessage.success(t('submit_feedback_success'));
        navigation.goBack();
        return;
      } else {
        showMessage.fail(t('submit_feedback_failed'));
      }
    } catch (err) {
      showMessage.fail(t('submit_feedback_failed'));
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <View style={{ marginBottom: 18 }}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );

  const Radio = ({
    value,
    onChange,
    options = [],
  }: {
    value: string;
    onChange: (val: string) => void;
    options?: { label: string; value: string }[];
  }) => {
    return (
      <View style={{ marginTop: 8 }}>
        {options.map((opt: any) => (
          <TouchableOpacity
            key={opt.value}
            style={styles.radioRow}
            onPress={() => onChange(opt.value)}
          >
            <View
              style={[
                styles.radioOuter,
                value === opt.value && styles.radioOuterActive,
              ]}
            >
              {value === opt.value && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.radioLabel}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <HeaderBackStatusBar title={t('app_survey')} />
      <SwitchSurvey
        scrollX={scrollX}
        activeTab={activeTab}
        onChange={handleTabChange}
      />
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
      >
        <View style={{ width: WIDTH, padding: 16 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* I. Tần suất */}
            <Section title={`I. ${t('survey_frequency_title')}`}>
              <Text style={styles.question}>{t('how_long_used_app')}</Text>
              <Radio
                options={[
                  { label: t('under_1_week'), value: 'less_than_week' },
                  { label: t('one_to_four_weeks'), value: '1_4_weeks' },
                  { label: t('one_to_three_months'), value: '1_3_months' },
                  {
                    label: t('over_three_months'),
                    value: 'more_than_3_months',
                  },
                ]}
                value={answers.used_duration ?? ''}
                onChange={v => set('used_duration', v)}
              />
              <Text style={[styles.question, { marginTop: 14 }]}>
                {t('how_often_use_app')}
              </Text>
              <Radio
                options={[
                  { label: t('daily'), value: 'daily' },
                  {
                    label: t('two_to_three_times_per_week'),
                    value: '2_3_per_week',
                  },
                  { label: t('once_per_week'), value: 'once_week' },
                  { label: t('less_often'), value: 'less' },
                ]}
                value={answers.frequency_usage ?? ''}
                onChange={v => set('frequency_usage', v)}
              />
            </Section>
            {/* II. UX */}
            <Section title={`II. ${t('ux_title')}`}>
              <Text style={styles.question}>{t('is_app_easy_to_use')}</Text>
              <Radio
                options={[
                  { label: t('very_easy'), value: 'very_easy' },
                  { label: t('easy'), value: 'easy' },
                  { label: t('normal'), value: 'average' },
                  { label: t('hard'), value: 'difficult' },
                  { label: t('very_hard'), value: 'very_difficult' },
                ]}
                value={answers.ux_easy ?? ''}
                onChange={v => set('ux_easy', v)}
              />
              <Text style={[styles.question, { marginTop: 14 }]}>
                {t('app_error_experience')}
              </Text>
              <Radio
                options={[
                  { label: t('often'), value: 'frequently' },
                  { label: t('sometimes'), value: 'occasionally' },
                  { label: t('rarely'), value: 'rarely' },
                  { label: t('never'), value: 'never' },
                ]}
                value={answers.encountered_issues ?? ''}
                onChange={v => set('encountered_issues', v)}
              />
              <Text style={[styles.question, { marginTop: 14 }]}>
                {t('app_speed_satisfaction')}
              </Text>
              <Radio
                options={[
                  { label: t('very_satisfied'), value: 'very_satisfied' },
                  { label: t('satisfied'), value: 'satisfied' },
                  { label: t('neutral'), value: 'neutral' },
                  { label: t('unsatisfied'), value: 'dissatisfied' },
                ]}
                value={answers.speed_satisfaction ?? ''}
                onChange={v => set('speed_satisfaction', v)}
              />
            </Section>
            {/* III. Chức năng */}
            <Section title={`III. ${t('functionality_title')}`}>
              <Text style={styles.question}>
                {t('app_has_enough_features')}
              </Text>
              <Radio
                options={[
                  { label: t('yes'), value: 'yes' },
                  { label: t('almost_enough'), value: 'almost' },
                  { label: t('missing_some_features'), value: 'missing_few' },
                  {
                    label: t('missing_many_important_features'),
                    value: 'missing_many',
                  },
                ]}
                value={answers.features_enough ?? ''}
                onChange={v => set('features_enough', v)}
              />
              <Text style={[styles.question, { marginTop: 12 }]}>
                {t('most_used_feature')}
              </Text>
              <TextInput
                style={styles.inputSurvey}
                placeholder={t('most_used_feature')}
                value={answers.most_used_feature}
                onChangeText={t => set('most_used_feature', t)}
              />
              <Text style={[styles.question, { marginTop: 12 }]}>
                {t('ineffective_features')}
              </Text>
              <Radio
                options={[
                  { label: t('yes'), value: 'yes' },
                  { label: t('no'), value: 'no' },
                ]}
                value={answers.ineffective_feature_exists ?? ''}
                onChange={v => set('ineffective_feature_exists', v)}
              />
              {answers.ineffective_feature_exists === 'yes' && (
                <TextInput
                  style={styles.inputSurvey}
                  placeholder={t('ineffective_features')}
                  value={answers.ineffective_feature_detail}
                  onChangeText={t => set('ineffective_feature_detail', t)}
                />
              )}
              <Text style={[styles.question, { marginTop: 12 }]}>
                {t('would_like_new_features')}
              </Text>
              <TextInput
                style={styles.inputSurvey}
                placeholder={t('would_like_new_features')}
                value={answers.desired_features}
                onChangeText={t => set('desired_features', t)}
              />
            </Section>
            {/* IV. UI */}
            <Section title={`IV. ${t('ui_title')}`}>
              <Text style={styles.question}>{t('rate_app_design')}</Text>
              <Radio
                options={[
                  { label: t('very_modern'), value: 'very_modern' },
                  { label: t('friendly'), value: 'clear' },
                  { label: t('neutral'), value: 'average' },
                  { label: t('messy_or_outdated'), value: 'cluttered' },
                ]}
                value={answers.ui_design_rating ?? ''}
                onChange={v => set('ui_design_rating', v)}
              />
              <Text style={[styles.question, { marginTop: 12 }]}>
                {t('does_ui_help_speed')}
              </Text>
              <Radio
                options={[
                  { label: t('yes'), value: 'yes' },
                  { label: t('partially'), value: 'partly' },
                  { label: t('no'), value: 'no' },
                ]}
                value={answers.ui_colors_help ?? ''}
                onChange={v => set('ui_colors_help', v)}
              />
            </Section>
            {/* V. Overall */}
            <Section title={`V. ${t('overall_satisfaction_title')}`}>
              <Text style={styles.question}>
                {t('rate_overall_satisfaction')}
              </Text>
              <View style={{ flexDirection: 'row', marginTop: 8 }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <TouchableOpacity
                    key={n}
                    style={[
                      styles.starBox,
                      answers.overall_rating === n && styles.starBoxActive,
                    ]}
                    onPress={() => set('overall_rating', n)}
                  >
                    <Text style={styles.starText}>★</Text>
                    <Text style={styles.starNum}>{n}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={[styles.question, { marginTop: 12 }]}>
                {t('would_recommend_app')}
              </Text>
              <Radio
                options={[
                  { label: t('yes'), value: 'yes' },
                  { label: t('maybe'), value: 'maybe' },
                  { label: t('no'), value: 'no' },
                ]}
                value={answers.recommend ?? ''}
                onChange={v => set('recommend', v)}
              />
              <Text style={[styles.question, { marginTop: 12 }]}>
                {t('favorite_thing_about_app')}
              </Text>
              <TextInput
                style={styles.inputSurvey}
                placeholder={t('favorite_thing_about_app')}
                value={answers.liked_most}
                onChangeText={t => set('liked_most', t)}
              />
              <Text style={[styles.question, { marginTop: 12 }]}>
                {t('thing_to_improve')}
              </Text>
              <TextInput
                style={styles.inputSurvey}
                placeholder={t('thing_to_improve')}
                value={answers.want_improve}
                onChangeText={t => set('want_improve', t)}
              />
            </Section>
            <Section title={`VI. ${t('open_question_title')}`}>
              <Text style={styles.question}>{t('additional_feedback')}</Text>
              <TextInput
                style={[styles.inputSurvey, { minHeight: 80 }]}
                placeholder={t('additional_feedback')}
                multiline
                value={answers.suggestions}
                onChangeText={t => set('suggestions', t)}
              />
            </Section>
            <ActionButton title={t('submit_feedback')} onPress={onSurvey} />
          </ScrollView>
        </View>
        <View style={{ width: WIDTH, padding: 16 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl
                onRefresh={refetch}
                refreshing={refreshControl.current}
              />
            }
          >
            {(() => {
              const list = surveyList as Record<string, number>;
              const total = Object.values(list).reduce((a, b) => a + b, 0);
              const average =
                total === 0
                  ? 0
                  : (
                      Object.entries(list).reduce(
                        (sum, [key, value]) =>
                          sum + Number(key) * Number(value),
                        0,
                      ) / total
                    ).toFixed(1);
              const fiveStarPercent = total
                ? ((list['5'] ?? 0) / total) * 100
                : 0;
              const negativePercent = total
                ? (((list['0'] ?? 0) + (list['1'] ?? 0)) / total) * 100
                : 0;
              return (
                <>
                  <View style={{ alignItems: 'center', marginTop: 20 }}>
                    <Text style={styles.ratingNumber}>{average}</Text>
                    <Text style={styles.ratingStar}>⭐ ⭐ ⭐ ⭐ ⭐</Text>
                    <Text style={styles.ratingSubText}>
                      {total} {t('rating')}
                    </Text>
                  </View>
                  <View style={{ marginTop: 24 }}>
                    <Text style={styles.ratingTitle}>
                      {t('rating_distribution')}
                    </Text>
                    {Object.entries(list)
                      .sort(([a], [b]) => Number(b) - Number(a))
                      .map(([key, value]) => {
                        const percent = total ? (value / total) * 100 : 0;
                        return (
                          <View key={key} style={styles.processRating}>
                            <Text style={styles.processRatingNumber}>
                              {key}
                            </Text>
                            <Text style={{ marginRight: 6 }}>⭐</Text>
                            <View style={styles.processLineContainer}>
                              <View
                                style={[
                                  {
                                    width: `${percent}%`,
                                  },
                                  styles.processLine,
                                ]}
                              />
                            </View>
                            <Text style={styles.ratingUser}>
                              {value} {t('user')}
                            </Text>
                          </View>
                        );
                      })}
                  </View>
                  <View style={styles.ratingSamary}>
                    <View style={styles.ratingDetail}>
                      <Text style={styles.ratingText}>
                        {Math.round(fiveStarPercent)}%
                      </Text>
                      <Text style={styles.ratingSubText}>
                        {t('five_star_rating')}
                      </Text>
                    </View>

                    <View style={styles.ratingDetail}>
                      <Text style={styles.ratingText}>
                        {Math.round(negativePercent)}%
                      </Text>
                      <Text style={styles.ratingSubText}>
                        {t('negative_reviews')}
                      </Text>
                    </View>
                  </View>
                </>
              );
            })()}
          </ScrollView>
        </View>
      </Animated.ScrollView>
    </View>
  );
}
