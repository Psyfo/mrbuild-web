import { NextResponse } from 'next/server';

import { getActiveNavigation } from '@/lib/services/navigation.service';

export async function GET() {
  try {
    const navigation = await getActiveNavigation();
    const hasActiveNavigation = navigation.length > 0;

    return NextResponse.json({
      navigation,
      hasActiveNavigation,
      count: navigation.length,
    });
  } catch (error) {
    console.error('Error fetching navigation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch navigation' },
      { status: 500 }
    );
  }
}
