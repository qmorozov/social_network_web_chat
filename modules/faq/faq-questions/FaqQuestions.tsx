import { useEffect } from 'react';
import Collapse from '../../../component/collapse/Collapse';
import Loader from '../../../component/loader/Loader';
import { useService } from '../../../hooks/useService';
import { useTypedSelector } from '../../../hooks/useTypedSelector';
import { FaqDTO } from '../dto/faq';
import { FaqProvider } from '../faq.service';
import Style from './FaqQuestions.module.scss';
import { useAuth } from '../../../hooks/useAuth';

const FaqQuestions = () => {
  const { selectedLanguage } = useAuth();
  const { faqQuestions, loading, language } = useTypedSelector(
    (state) => state.faqQuestions
  );
  const { getFaqQuestions } = useService(FaqProvider);

  useEffect(() => {
    if (language !== selectedLanguage || (!faqQuestions.length && !loading)) {
      getFaqQuestions(selectedLanguage);
    }
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      {faqQuestions.map((item: FaqDTO) => {
        return (
          <Collapse title={item.question} key={item.answer}>
            <div className={Style.CollapseContent}>
              <hr />
              <p>{item.answer}</p>
              <hr />
            </div>
          </Collapse>
        );
      })}
    </div>
  );
};

export default FaqQuestions;
