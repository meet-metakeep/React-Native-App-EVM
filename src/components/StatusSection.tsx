/**
 * Status Section Component
 * Displays MetaKeep SDK initialization status and App ID
 */

import React from 'react';
import {View, Text} from 'react-native';
import {Section} from './Section';
import {StatusSectionProps} from '../types/types';
import {styles} from '../styles/styles';
import {CONFIG} from '../config/config';

export function StatusSection({
  metakeepInitialized,
}: StatusSectionProps): React.JSX.Element {
  return (
    <Section title="MetaKeep SDK Status">
      <View style={styles.statusContainer}>
        {/* Status indicator */}
        <View style={styles.statusIndicator}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>
            {metakeepInitialized ? '✓ Initialized' : 'Initializing...'}
          </Text>
        </View>
        {/* App ID display */}
        <Text style={styles.appIdText}>
          App ID: {metakeepInitialized ? CONFIG.METAKEEP_APP_ID : 'Loading...'}
        </Text>
      </View>
    </Section>
  );
}

