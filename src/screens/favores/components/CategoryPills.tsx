import React from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { CATEGORIAS } from '../../../data/categories';
import { useLanguage } from '../../../context/LanguageContext';

interface CategoryPillsProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export default function CategoryPills({ selectedCategory, onSelectCategory }: CategoryPillsProps) {
  const { t } = useLanguage();

  // "Todos" + la lista centralizada de categorías (compartida con el formulario de creación)
  const CATEGORIES = [{ id: 'todos', label: t.categoryPills.all, icon: '🌍' }, ...CATEGORIAS];

  return (
    <View style={styles.container}>
   <ScrollView 
  horizontal 
  showsHorizontalScrollIndicator={false}
  nestedScrollEnabled={true}          // ← clave para el BottomSheet
  decelerationRate="fast"             // ← sensación más snappy de carrusel
  contentContainerStyle={styles.scrollContent}
>

        {CATEGORIES.map((category) => {
          const isActive = selectedCategory === category.id;
          return (
            <TouchableOpacity
              key={category.id}
              style={[styles.pill, isActive && styles.pillActive]}
              onPress={() => onSelectCategory(category.id)}
              activeOpacity={0.7}
            >
              <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                {category.icon} {t.categories[category.id as keyof typeof t.categories] ?? category.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  marginVertical: 10,

  zIndex: 10, // <--- Agrega esto para que esté siempre arriba
  elevation: 5, // <--- Para Android
},
  scrollContent: {
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  pill: {
    backgroundColor: '#F0F0F0', // Gris clarito para las inactivas
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  pillActive: {
    backgroundColor: '#f97362',
    borderColor: '#f97362',
  },
  pillText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  pillTextActive: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});