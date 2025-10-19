import { INavigation } from '@/types/navigation';
import * as navigationRepository from '../repositories/navigation.repository';

export async function getAllNavigation(): Promise<INavigation[]> {
  return navigationRepository.findAll();
}

export async function getActiveNavigation(): Promise<INavigation[]> {
  return navigationRepository.findAllActive();
}

export async function getNavigationById(
  id: string
): Promise<INavigation | null> {
  return navigationRepository.findById(id);
}

export async function createNavigation(
  navigation: Omit<INavigation, '_id'>
): Promise<INavigation> {
  return navigationRepository.create(navigation);
}

export async function updateNavigation(
  id: string,
  updates: Partial<INavigation>
): Promise<boolean> {
  return navigationRepository.update(id, updates);
}

export async function deleteNavigation(id: string): Promise<boolean> {
  return navigationRepository.deleteNavigation(id);
}

export async function reorderNavigation(
  items: { id: string; order: number }[]
): Promise<boolean> {
  return navigationRepository.reorder(items);
}
