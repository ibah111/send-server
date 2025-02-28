import { QueryInterface } from 'sequelize';
import { MigrationFn } from 'umzug';

export const up: MigrationFn<QueryInterface> = async ({ context }) => {
  return context.bulkInsert(
    'Links',
    [
      {
        item_name: 'Определение ОСП с сайта ФССП',
        item_url: 'https://old.fssp.gov.ru/osp/',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        item_name: '2gis',
        item_url: 'https://2gis.ru/kirov',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        item_name: 'ЕГРЮЛ-Налог',
        item_url: 'https://egrul.nalog.ru/index.html',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        item_name: 'КАД.Арбитр',
        item_url: 'https://kad.arbitr.ru/',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        item_name: 'Расчёт %',
        item_url: 'https://chat.nbkfinance.ru/apps/forming/osp',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        item_name: 'Долг бюро (МСК)',
        item_url: 'https://dolgburo.ru/moskva_opredelenie_otdela_ssp_po_adresу',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        item_name: 'Долг бюро (СПБ)',
        item_url:
          'https://dolgburo.ru/sankt-peterburg_opredelenie_otdela_ssp_po_adresу',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {},
  );
};

export const down: MigrationFn<QueryInterface> = async ({ context }) => {
  return context.bulkDelete('Links', {}, {});
};
