// Wallpaper configuration
export const wallpapers = [
  {
    id: 1,
    name: 'Wallpaper 1',
    path: '/wallpapers/1.jpg',
    thumbnail: '/wallpapers/1.jpg' // In production, use optimized thumbnails
  },
  {
    id: 2,
    name: 'Wallpaper 2',
    path: '/wallpapers/2.jpg',
    thumbnail: '/wallpapers/2.jpg'
  },
  {
    id: 3,
    name: 'Wallpaper 3',
    path: '/wallpapers/3.jpg',
    thumbnail: '/wallpapers/3.jpg'
  },
  {
    id: 4,
    name: 'Wallpaper 4',
    path: '/wallpapers/4.jpg',
    thumbnail: '/wallpapers/4.jpg'
  },
  {
    id: 5,
    name: 'Wallpaper 5',
    path: '/wallpapers/5.jpg',
    thumbnail: '/wallpapers/5.jpg'
  }
];

export const defaultWallpaper = {
  id: 0,
  name: 'Default Gradient',
  path: null // null means use gradient
};
