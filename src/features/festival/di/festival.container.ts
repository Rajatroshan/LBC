import { FirebaseFestivalRepository } from '../data/repositories/firebase-festival.repository';
import { CreateFestivalUseCase } from '../domain/usecases/create-festival.usecase';
import { UpdateFestivalUseCase } from '../domain/usecases/update-festival.usecase';
import { DeleteFestivalUseCase } from '../domain/usecases/delete-festival.usecase';
import { GetUpcomingFestivalsUseCase } from '../domain/usecases/get-upcoming-festivals.usecase';
import { GetFestivalsUseCase } from '../domain/usecases/get-festivals.usecase';

class FestivalContainer {
  private _festivalRepository: FirebaseFestivalRepository | null = null;

  festivalRepository(): FirebaseFestivalRepository {
    if (!this._festivalRepository) {
      this._festivalRepository = new FirebaseFestivalRepository();
    }
    return this._festivalRepository;
  }

  createFestivalUseCase(): CreateFestivalUseCase {
    return new CreateFestivalUseCase(this.festivalRepository());
  }

  updateFestivalUseCase(): UpdateFestivalUseCase {
    return new UpdateFestivalUseCase(this.festivalRepository());
  }

  deleteFestivalUseCase(): DeleteFestivalUseCase {
    return new DeleteFestivalUseCase(this.festivalRepository());
  }

  getUpcomingFestivalsUseCase(): GetUpcomingFestivalsUseCase {
    return new GetUpcomingFestivalsUseCase(this.festivalRepository());
  }

  getFestivalsUseCase(): GetFestivalsUseCase {
    return new GetFestivalsUseCase(this.festivalRepository());
  }
}

export const festivalContainer = new FestivalContainer();
