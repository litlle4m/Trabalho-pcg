import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { TravelData } from '../types/travel';

interface TravelFormProps {
  travel: TravelData;
  onChange: (travel: TravelData) => void;
  index: number;
}

const TravelForm: React.FC<TravelFormProps> = ({ travel, onChange, index }) => {
  const handleChange = (field: keyof TravelData, value: string | number) => {
    onChange({
      ...travel,
      [field]: field === 'name' ? value : Number(value) || 0
    });
  };

  const gradients = [
    'bg-gradient-to-br from-travel-blue to-travel-teal',
    'bg-gradient-to-br from-travel-purple to-accent',
    'bg-gradient-to-br from-travel-gold to-warning'
  ];

  return (
    <Card className="overflow-hidden border-2 hover:shadow-lg transition-all duration-300">
      <CardHeader className={`${gradients[index]} text-white relative`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <CardTitle className="relative z-10 text-xl font-bold">
          Destino {index + 1}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`name-${index}`} className="text-sm font-medium">
            Nome do Destino
          </Label>
          <Input
            id={`name-${index}`}
            placeholder="Ex: Paris, França"
            value={travel.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="border-2 focus:border-primary transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`ticket-${index}`} className="text-sm font-medium">
              Passagem (R$)
            </Label>
            <Input
              id={`ticket-${index}`}
              type="number"
              placeholder="1500"
              value={travel.ticketPrice || ''}
              onChange={(e) => handleChange('ticketPrice', e.target.value)}
              className="border-2 focus:border-primary transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`days-${index}`} className="text-sm font-medium">
              Dias de Estadia
            </Label>
            <Input
              id={`days-${index}`}
              type="number"
              placeholder="7"
              value={travel.stayDays || ''}
              onChange={(e) => handleChange('stayDays', e.target.value)}
              className="border-2 focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`hotel-${index}`} className="text-sm font-medium">
            Hotel por Dia (R$)
          </Label>
          <Input
            id={`hotel-${index}`}
            type="number"
            placeholder="200"
            value={travel.hotelPricePerDay || ''}
            onChange={(e) => handleChange('hotelPricePerDay', e.target.value)}
            className="border-2 focus:border-primary transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`food-${index}`} className="text-sm font-medium">
              Alimentação/Dia (R$)
            </Label>
            <Input
              id={`food-${index}`}
              type="number"
              placeholder="80"
              value={travel.foodPricePerDay || ''}
              onChange={(e) => handleChange('foodPricePerDay', e.target.value)}
              className="border-2 focus:border-primary transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`entertainment-${index}`} className="text-sm font-medium">
              Entretenimento/Dia (R$)
            </Label>
            <Input
              id={`entertainment-${index}`}
              type="number"
              placeholder="100"
              value={travel.entertainmentPricePerDay || ''}
              onChange={(e) => handleChange('entertainmentPricePerDay', e.target.value)}
              className="border-2 focus:border-primary transition-colors"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TravelForm;
