import { Link } from '@/TabNewsUI';
import { CgTab } from '@/TabNewsUI/icons';

import classes from './index.module.css';

export default function Footer(props) {
  return (
    <footer {...props}>
      <div className={classes.Container}>
        <div className={classes.Copyright}>
          <Link className={classes.HomeLink} href="/" aria-label="Voltar para a página inicial">
            <CgTab size={26} />
          </Link>
          &copy; {new Date().getFullYear()} MediaLake
        </div>
        <div className={classes.Links}>
          <Link href="/recentes/rss">RSS</Link>
          <Link href="/sobre">Sobre</Link>
          <Link href="/status">Status</Link>
          <Link href="https://github.com/filipedeschamps/tabnews.com.br">Baseado no código do TabNews</Link>
        </div>
      </div>
    </footer>
  );
}
