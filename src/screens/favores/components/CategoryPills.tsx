import React from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet, View } from 'react-native';

// Lista de categorías (luego esto puede venir del backend de Lourdes)
const CATEGORIES = [
  { id: 'todos', label: 'Todos', icon: '🌍' },
  { id: 'reparaciones', label: 'Reparaciones', icon: '🛠️' },
  { id: 'mascotas', label: 'Mascotas', icon: '🐕' },
  { id: 'tramites', label: 'Trámites', icon: '⚖️' },
  { id: 'mudanza', label: 'Mudanza', icon: '📦' },
  { id: 'regalos', label: 'Regalos', icon: '🎁' },
];

interface CategoryPillsProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export default function CategoryPills({ selectedCategory, onSelectCategory }: CategoryPillsProps) {
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
                {category.icon} {category.label}
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
    backgroundColor: '#007BFF', // Azul vibrante para la activa
    borderColor: '#007BFF',
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