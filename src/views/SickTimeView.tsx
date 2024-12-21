import { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import SickCallOutForm from '../components/sickTime/SickCallOutForm';
import FMLAForm from '../components/sickTime/FMLAForm';
import InjuryForm from '../components/sickTime/InjuryForm';
import type { SickTimeFormData } from '../types/sickTime';
import { sickTimeService } from '../services/sickTimeService';
import { notificationService } from '../services/notificationService';

type ModalType = 'sick' | 'fmla' | 'injury' | null;

const SickTimeView = () => {
    const [activeModal, setActiveModal] = useState<ModalType>(null);

    const handleSubmit = async (type: ModalType, data: SickTimeFormData) => {
        if (!type) return;

        try {
            await sickTimeService.createSickTimeRecord(type, data);
            notificationService.success('Record created successfully');
            setActiveModal(null);
        } catch (error) {
            notificationService.error(error instanceof Error ? error.message : 'Failed to create record');
        }
    };

    const renderForm = () => {
        switch (activeModal) {
            case 'sick':
                return (
                    <SickCallOutForm
                        onSubmit={(data) => handleSubmit('sick', data)}
                        onCancel={() => setActiveModal(null)}
                    />
                );
            case 'fmla':
                return (
                    <FMLAForm
                        onSubmit={(data) => handleSubmit('fmla', data)}
                        onCancel={() => setActiveModal(null)}
                    />
                );
            case 'injury':
                return (
                    <InjuryForm
                        onSubmit={(data) => handleSubmit('injury', data)}
                        onCancel={() => setActiveModal(null)}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Sick Time Management
                </h1>
            </div>

            <Card>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button 
                            variant="primary" 
                            size="large"
                            fullWidth
                            onClick={() => setActiveModal('sick')}
                        >
                            Sick Call Out
                        </Button>
                        <Button 
                            variant="primary" 
                            size="large"
                            fullWidth
                            onClick={() => setActiveModal('fmla')}
                        >
                            FMLA
                        </Button>
                        <Button 
                            variant="primary" 
                            size="large"
                            fullWidth
                            onClick={() => setActiveModal('injury')}
                        >
                            Injury on Duty
                        </Button>
                    </div>
                </div>
            </Card>

            <Modal
                isOpen={activeModal !== null}
                onClose={() => setActiveModal(null)}
                title={
                    activeModal === 'sick' ? 'Sick Call Out' :
                    activeModal === 'fmla' ? 'FMLA Request' :
                    activeModal === 'injury' ? 'Injury on Duty Report' :
                    ''
                }
            >
                {renderForm()}
            </Modal>
        </div>
    );
};

export default SickTimeView;
