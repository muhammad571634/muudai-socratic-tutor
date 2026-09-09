import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Calculator, Atom, Flask } from 'phosphor-react-native';
import { SubjectItem } from '../../domain/entities/Gamification';
import { theme } from '../../core/theme';

export interface SubjectCardProps {
  subject: SubjectItem;
  isSelected: boolean;
  onSelect: (subject: SubjectItem) => void;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  isSelected,
  onSelect,
}) => {
  const renderSubjectIcon = () => {
    switch (subject.id) {
      case 'math':
        return <Calculator size={28} color={subject.accentColor} weight="bold" />;
      case 'physics':
        return <Atom size={28} color={subject.accentColor} weight="bold" />;
      case 'chemistry':
      default:
        return <Flask size={28} color={subject.accentColor} weight="bold" />;
    }
  };

  const isComingSoon = subject.id !== 'math';

  return (
    <TouchableOpacity
      style={[
        styles.cardContainer,
        { borderColor: isSelected ? subject.accentColor : theme.colors.borderLight },
        isSelected ? styles.selectedCard : null,
        isComingSoon ? styles.comingSoonCard : null,
      ]}
      activeOpacity={isComingSoon ? 1 : 0.85}
      disabled={isComingSoon}
      onPress={() => onSelect(subject)}
    >
      {/* Top Header Row */}
      <View style={styles.topRow}>
        {/* Crisp Vector Icon Container */}
        <View
          style={[
            styles.iconBox,
            {
              backgroundColor: isComingSoon ? theme.colors.surfaceMuted : `${subject.accentColor}15`,
              borderColor: isComingSoon ? theme.colors.borderLight : `${subject.accentColor}35`,
            },
          ]}
        >
          {renderSubjectIcon()}
        </View>

        {/* Title & Subtitle */}
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>{subject.title}</Text>
          <Text style={styles.subtitleText} numberOfLines={2}>
            {subject.subtitle}
          </Text>
        </View>

        {/* Action Button */}
        <View style={styles.actionContainer}>
          <View
            style={[
              styles.startButton,
              isComingSoon
                ? styles.comingSoonButton
                : {
                    backgroundColor: isSelected ? subject.accentColor : `${subject.accentColor}18`,
                    borderColor: subject.accentColor,
                  },
            ]}
          >
            <Text
              style={[
                styles.startText,
                isComingSoon
                  ? styles.comingSoonText
                  : { color: isSelected ? '#FFFFFF' : subject.accentColor },
              ]}
            >
              {isComingSoon ? 'Tez orada' : isSelected ? 'Active' : 'Start'}
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom Progress Bar & Stats */}
      <View style={styles.footerRow}>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressBar,
              {
                width: isComingSoon ? '0%' : `${subject.progressPercent}%`,
                backgroundColor: isComingSoon ? theme.colors.badgeLockedBorder : subject.accentColor,
              },
            ]}
          />
        </View>
        <Text style={styles.statsText}>
          {isComingSoon ? 'V1.2 da qaytadi' : subject.statsText}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 2,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2.2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1.5,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  titleText: {
    color: theme.colors.textDark,
    ...theme.typography.title2,
    fontSize: 19,
    marginBottom: 2,
  },
  subtitleText: {
    color: theme.colors.textMuted,
    ...theme.typography.body,
    fontSize: 13,
    lineHeight: 18,
  },
  actionContainer: {
    justifyContent: 'center',
  },
  startButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.radii.pill,
    borderWidth: 1.5,
  },
  startText: {
    fontSize: 13,
    fontWeight: '800',
  },
  comingSoonCard: {
    opacity: 0.55,
  },
  comingSoonButton: {
    backgroundColor: theme.colors.badgeLockedBg,
    borderColor: theme.colors.badgeLockedBorder,
  },
  comingSoonText: {
    color: theme.colors.badgeLockedText,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F0ECE1',
    marginRight: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  statsText: {
    color: theme.colors.textMuted,
    ...theme.typography.footnote,
    fontSize: 12,
  },
});
