
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCurrentMonthName } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";
import { useState } from "react";
import ProfessionalModal from "./ProfessionalModal";

interface ProfessionalRankingProps {
  data: any[];
  onSelectProfessional: (professional: string) => void;
  professionalDetails: any;
  selectedCategory: string;
  showDetails: boolean;
  onCloseDetails: () => void;
}

export default function ProfessionalRanking({ 
  data, 
  onSelectProfessional, 
  professionalDetails, 
  selectedCategory,
  showDetails,
  onCloseDetails
}: ProfessionalRankingProps) {
  const currentMonth = getCurrentMonthName();
  
  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhum profissional com pontuação nesta categoria no mês de {currentMonth}.</p>
      </div>
    );
  }

  const handleProfessionalClick = (professional: string) => {
    onSelectProfessional(professional);
  };
  
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 text-center">Posição</TableHead>
            <TableHead>Profissional</TableHead>
            <TableHead className="text-right">Pontuação</TableHead>
            <TableHead className="w-16"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow 
              key={item.professional} 
              className={`cursor-pointer hover:bg-gray-100 ${index === 0 ? "bg-green-100 hover:bg-green-200" : ""}`}
              onClick={() => handleProfessionalClick(item.professional)}
            >
              <TableCell className="text-center font-medium">
                {index + 1}º
              </TableCell>
              <TableCell>{item.professional}</TableCell>
              <TableCell className="text-right font-semibold">
                {item.points} {item.points === 1 ? "ponto" : "pontos"}
              </TableCell>
              <TableCell>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-1 h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProfessionalClick(item.professional);
                  }}
                >
                  <UserCircle className="h-5 w-5" />
                  <span className="sr-only">Ver detalhes de {item.professional}</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ProfessionalModal 
        isOpen={showDetails}
        onClose={onCloseDetails}
        details={professionalDetails}
        category={selectedCategory}
      />
    </>
  );
}
