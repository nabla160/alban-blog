import type { Metadata } from 'next'
import SectionPage from '@/components/SectionPage'

export const metadata: Metadata = {
  title: 'Associations',
}

export default function AssosPage() {
  return (
    <SectionPage
      color="#10b981"
      tag="Associations et vie étudiante"
      title="Associations"
      description="S'investir, créer, faire le liens entre les étudiants et entre les établissements."
      longDescription="La vie associative de l'université PSL est une extraordinaire opportunité. Réunissant d'excellant étudiants étudiants dans tous les domaines, cet environnement permet ensemble de construire des projets ambitieux. Voici les associations auxquelles je participe ou ai participé, et les projets qui en ont découlé."
      projets={[
        {
          title: 'Président de l\u2019Union PSL',
          description:
            'Élu Président de l\u2019Union PSL en avril 2025, je coordonne la vie associative étudiante à l\u2019échelle de l\u2019Université PSL, fédère les associations membres et représente les étudiants auprès des instances de l\u2019université.',
          year: 'Depuis 2025',
          link: 'https://www.chimieparistech.psl.eu/ecole/actualites/alban-laborde-laulhe-eleve-ingenieur-au-coeur-des-associations-etudiantes-de-luniversite-psl/',
        },
        {
          title: 'Sénat Académique de PSL',
          description:
            'Élu au Sénat Académique de PSL, instance délibérative de l\u2019université. Le Sénat se réunira à l\u2019issue des élections partielles d\u2019avril 2026. Si les règles de confidentialité le permettent, je publierai des comptes rendus de séance sur ce site.',
          year: 'Depuis 2025',
        },
        {
          title: 'Trésorier de Broadway \u2013 PSL',
          description:
            'Responsable de la gestion financière de Broadway \u2013 PSL, association culturelle et artistique de PSL : suivi du budget, relations avec les partenaires, financement des projets, et orgaisation de la vie de troupe. Il s\u2019 de construire un ecosystème sûr dans lequel les artistes peuvent explorer leurs idées créatrices.',
          year: 'Depuis 2024',
        },
      ]}
      images={[]}
    />
  )
}
